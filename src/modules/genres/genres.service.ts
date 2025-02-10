import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from 'src/schemas/genre.schema';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre.name) private genreModel:Model<Genre>,

){}
  create(createGenreDto: CreateGenreDto) {
    const genre = new this.genreModel(createGenreDto)
    return genre.save()
  }

  findAll() {
    return this.genreModel.find().populate('books').exec()
  }

  findOne(id: string) {
    return this.genreModel.findOne({
      _id:id
    }).populate('books').exec()
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreModel.findByIdAndUpdate(id, updateGenreDto, { new: true });

    if(!genre){
      throw new HttpException(`Genre with the id ${id} not found`, HttpStatus.NOT_FOUND)
    }

    return genre

  }

  async remove(id: string) {
    const genre = await this.genreModel.findById(id)
    if(!genre){
      throw new HttpException(`Genre with the id ${id} not found`, HttpStatus.NOT_FOUND)
    }
    return await genre.deleteOne({_id:id})
  }
}
