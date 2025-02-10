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

}

