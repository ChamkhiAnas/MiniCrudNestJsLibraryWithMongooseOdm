import { Injectable } from '@nestjs/common';
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
    return `This action returns all authors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
