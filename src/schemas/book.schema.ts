import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Book{
    @Prop()
    id:number;

    @Prop({type:String})
    title:string;

    @Prop({type:String})
    summary:string;

    @Prop({type:Date})
    publishedDate:Date;


    @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }] }) // Array of Book references
    genres: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'Author' }) // Single reference to an Author
    author: Types.ObjectId;

}

export const BookSchema=SchemaFactory.createForClass(Book)