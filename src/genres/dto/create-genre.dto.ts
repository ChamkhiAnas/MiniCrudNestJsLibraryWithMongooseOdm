
import { Type } from "class-transformer";
import {  IsString,IsArray,IsMongoId } from "class-validator";


export class CreateGenreDto {

    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsArray()
    @IsMongoId({ each: true }) // Validate that each item in the array is a valid MongoDB ObjectId
    books: string[];
}
