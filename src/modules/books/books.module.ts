import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book,BookSchema } from 'src/schemas/book.schema';
import { Genre,GenreSchema } from 'src/schemas/genre.schema';
import { Author,AuthorSchema } from 'src/schemas/author.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Book.name,
        schema:BookSchema
      },
      {
        name:Genre.name,
        schema:GenreSchema
      },
      {
        name:Author.name,
        schema:AuthorSchema
      },
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
