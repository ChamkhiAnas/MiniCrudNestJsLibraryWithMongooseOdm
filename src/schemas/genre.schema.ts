import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Genre{

    @Prop()
    id:number;

    @Prop({type:String})
    name:string;

    @Prop({type:String})
    description:string;

}

export const GenreSchema=SchemaFactory.createForClass(Genre)