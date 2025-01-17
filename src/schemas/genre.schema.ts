import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Genre {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] })  // Reference to Book collection
  books: Types.ObjectId[];
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
