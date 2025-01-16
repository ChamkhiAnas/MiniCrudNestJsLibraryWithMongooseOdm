import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './entities/book.entity';
import { Genre } from 'src/genres/entities/genre.entity';
import { Author } from 'src/schemas/author.schema';
@Injectable()
export class BooksService {

  constructor(
    @InjectModel(Book.name) private bookModel:Model<Book>,
    @InjectModel(Genre.name) private genreModel:Model<Genre>,
    @InjectModel(Author.name) private authorModel:Model<Author>,



){}

async create(createBookDto: CreateBookDto) {
  const session = await this.bookModel.db.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    // Step 1: Save the book with session
    const book = new this.bookModel(createBookDto);
    const savedBook = await book.save({ session });

    // Step 2: Validate genres
    const genres = await this.genreModel.find({ _id: { $in: createBookDto.genres } }).session(session);
    if (genres.length !== createBookDto.genres.length) {
      throw new HttpException('Some genres do not exist', HttpStatus.NOT_FOUND);
    }

    // Step 3: Validate author
    const author = await this.authorModel.findOne({ _id: createBookDto.author }).session(session);
    if (!author) {
      throw new HttpException(`Author not found with the id ${createBookDto.author}`, HttpStatus.NOT_FOUND);
    }

    // Step 4: Update genres with the new book
    await this.genreModel.updateMany(
      { _id: { $in: createBookDto.genres } },
      { $push: { books: savedBook._id } },
      { session } // Pass the session
    );

    // Step 5: Update author with the new book
    await this.authorModel.updateOne(
      { _id: createBookDto.author },
      { $push: { books: savedBook._id } },
      { session } // Pass the session
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return savedBook;

  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}


  findAll() {
    return this.bookModel.find()
  }

  findOne(id: string) {
    return this.bookModel.findById(id)
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    
    //1) search if the book with the id exist 
    const currentBook = await this.bookModel.findById(id).exec();
    if (!currentBook) {
      throw new HttpException(`Book with ID ${id} not found`,HttpStatus.NOT_FOUND);
    }

    const author= await this.authorModel.find({_id:updateBookDto.author})

    if(!author){
      throw new HttpException(`Author with ID ${id} not found`,HttpStatus.NOT_FOUND);
    }


    //2) check if genres id in updateBookDto exist in genres collection 
    const genres = await this.genreModel.find({ _id: { $in: updateBookDto.genres } });
    if (genres.length !== updateBookDto.genres.length) {
      throw new HttpException('Some books do not exist in the genres',HttpStatus.NOT_FOUND);
    }
    
    const bookUpdated=await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
    

    //4) remove book proprety from old genre collection
    const deleteBookFromGenre=await this.genreModel.updateMany(
      { _id: { $in: currentBook["genres"] } },
      { $pull: { books: currentBook["_id"] } }, // Remove the book ID from the `books` array
    );


    // 5) add book to the new genre 
    await this.genreModel.updateMany(
      { _id: { $in: bookUpdated["genres"] } },
      { $push: { books: bookUpdated["_id"] } }, // Add the book ID to the `books` array
    );


    await this.authorModel.updateOne(
      { _id: currentBook["author"] }, 
      { $pull: { books: currentBook["_id"] } }, 
    )

    await this.authorModel.updateOne(
      { _id: bookUpdated["author"] }, 
      { $push: { books: bookUpdated["_id"] } }, 
    )


    return bookUpdated;


    
  }

  async remove(id: string) {

  const currentBook=await this.bookModel.findById(id)

  if(!currentBook){
    throw new HttpException(`book with this id ${id} not found`,HttpStatus.NOT_FOUND)
  }

  await this.genreModel.updateMany(
    { _id: { $in: currentBook["genres"] } },
    { $pull: { books: currentBook["_id"] } }, // Remove the book ID from the `books` array
  );

  return await currentBook.deleteOne({_id:id})




  }
}
