import { Type } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsString,IsOptional } from "class-validator";

export class CreateBookDto {

    @IsString()
    title:string;


    @IsString()
    summary:string;


    @IsDate()
    @Type(() => Date)
    publishedDate:Date

    @IsArray()
    @IsMongoId({ each: true }) 
    genres: string[];

    @IsMongoId() 
    author: string;

}

