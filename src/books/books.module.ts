import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from 'src/schemas/author.schema';
import { Book,BookSchema } from 'src/schemas/book.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Author.name,
        schema:AuthorSchema
      },
      {
        name:Book.name,
        schema:BookSchema
      },
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
