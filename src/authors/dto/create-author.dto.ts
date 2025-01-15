import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateAuthorDto {
   
    @IsString()
    name:string;

    @IsString()
    bio:string;

    @IsDate()
    @Type(() => Date)
    birthDate:Date
}
