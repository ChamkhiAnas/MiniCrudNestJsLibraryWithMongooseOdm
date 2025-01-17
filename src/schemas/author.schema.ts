import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bio: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] })  // Reference to Book collection
  books: Types.ObjectId[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
