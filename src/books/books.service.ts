import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from 'src/schemas/author.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './entities/book.entity';
import { Genre } from 'src/genres/entities/genre.entity';
@Injectable()
export class BooksService {

  constructor(
    @InjectModel(Book.name) private bookModel:Model<Book>,
    @InjectModel(Genre.name) private genreModel:Model<Book>,


){}

  async create(createBookDto: CreateBookDto) {
    const book=new this.bookModel(createBookDto)
    const savedBook = await book.save();

    const genres= await this.genreModel.find({_id:{$in:createBookDto.genres}});

    if (genres.length !== createBookDto.genres.length) {
      throw new HttpException('Some books do not exist in the genres',HttpStatus.NOT_FOUND);
    }

    await this.genreModel.updateMany(
      { _id: { $in: createBookDto.genres } }, // Find all genres in the array
      { $push: { books: savedBook._id } },   // Push the book ID into their books array
    );

    return savedBook
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
