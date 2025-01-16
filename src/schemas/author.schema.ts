import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Author{

    @Prop()
    id:number;

    @Prop({ type: String})
    name:string;

    @Prop({ type: String })
    bio:string;

    @Prop({ type: Date})
    birthDate:Date

}

export const AuthorSchema=SchemaFactory.createForClass(Author)