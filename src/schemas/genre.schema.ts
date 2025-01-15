import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Genre{

    @Prop()
    id:number;

    @Prop({type:String})
    name:string;

    @Prop({type:String})
    description:string;


    @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] }) // Array of Book references
    books: Types.ObjectId[];

}

export const GenreSchema=SchemaFactory.createForClass(Genre)