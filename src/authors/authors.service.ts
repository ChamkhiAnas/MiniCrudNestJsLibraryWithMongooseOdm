import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from 'src/schemas/author.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthorsService {

  constructor(@InjectModel(Author.name) private authorModel:Model<Author>){}

  create(createAuthorDto: CreateAuthorDto) {
    const author = new this.authorModel(createAuthorDto)
    return author.save()
  }

  findAll() {
    return this.authorModel.find().populate('books').exec();
  }

  findOne(username: string) {
    return this.authorModel.findOne({
      name:username
    }).populate('books').exec();

  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {

    const author = await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, { new: true });

    if(!author){
      throw new HttpException(`Author with the id ${id} not found`,HttpStatus.NOT_FOUND)
    }

    return author

  }

  async remove(id: string) {
    const author=await this.authorModel.findById(id)
    if(!author){
      throw new HttpException(`Author with the ${id} not found`,HttpStatus.NOT_FOUND)
    }

     return await this.authorModel.deleteOne({ _id: id });

  }
}
