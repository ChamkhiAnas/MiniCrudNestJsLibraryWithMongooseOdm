import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from 'src/schemas/genre.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Genre.name,
        schema:GenreSchema
      },
    
    ])

  ],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
