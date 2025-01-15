import { Type } from "class-transformer";
import { IsDate, IsString,IsArray,IsMongoId,IsOptional } from "class-validator";

export class CreateAuthorDto {
   
    @IsString()
    name:string;

    @IsString()
    bio:string;

    @IsDate()
    @Type(() => Date)
    birthDate:Date

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true }) // Validate that each item in the array is a valid MongoDB ObjectId
    books:string[]
}

