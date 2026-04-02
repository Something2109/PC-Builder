import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Type, Content } from "@/utils/article";
import { Products } from "@/utils/part";

@Schema({ timestamps: true })
export class ArticleClass implements Omit<Type, "id"> {
  declare _id: string;

  declare __v: number;

  @Prop({ type: [{ type: String }] })
  declare topic: string;

  @Prop({ type: [{ type: String, enum: Object.values(Products) }] })
  declare part: Products;

  @Prop({ type: String, required: true })
  declare title: string;

  @Prop({ type: String, required: true })
  declare author: string;

  @Prop()
  declare standfirst: string;

  @Prop()
  declare content: Content[];

  declare createdAt: Date;

  declare updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleClass);
