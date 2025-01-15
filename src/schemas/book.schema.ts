import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

}

export const BookSchema=SchemaFactory.createForClass(Book)