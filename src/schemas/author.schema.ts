import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Author{

    @Prop({ required: true})
    id:number;

    @Prop({ type: String})
    name:string;

    @Prop({ type: String })
    bio:string;

    @Prop({ type: Date})
    birthDate:Date

}

export const AuthorSchema=SchemaFactory.createForClass(Author)