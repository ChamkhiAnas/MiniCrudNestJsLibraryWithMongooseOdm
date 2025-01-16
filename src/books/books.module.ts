import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book,BookSchema } from 'src/schemas/book.schema';
import { Genre,GenreSchema } from 'src/schemas/genre.schema';

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
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
