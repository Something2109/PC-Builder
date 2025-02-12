import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Article } from "@/utils/interface/article/article";
import { Products, Topics } from "@/utils/Enum";

@Schema({ timestamps: true })
export class ArticleClass implements Omit<Article.Type, "id"> {
  declare _id: string;

  declare __v: number;

  @Prop({ type: [{ type: String, enum: Object.values(Topics) }] })
  declare topic: Topics;

  @Prop({ type: [{ type: String, enum: Object.values(Products) }] })
  declare part: Products;

  @Prop({ type: String, required: true })
  declare title: string;

  @Prop({ type: String, required: true })
  declare author: string;

  @Prop()
  declare standfirst: string;

  @Prop()
  declare content: Article.Content[];

  declare createdAt: Date;

  declare updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleClass);
