
import { Type } from "class-transformer";
import {  IsString,IsArray,IsMongoId,IsOptional } from "class-validator";


export class CreateGenreDto {

    @IsString()
    name:string;

    @IsString()
    description:string;
    
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true }) 
    books: string[];
}
