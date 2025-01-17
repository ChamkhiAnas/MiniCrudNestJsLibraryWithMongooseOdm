import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Book {
  @Prop({ required: true })  // No need for a custom 'id', MongoDB provides '_id' automatically
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  publishedDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }] })  // Reference to Genre collection
  genres: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Author' })  // Reference to Author collection
  author: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
