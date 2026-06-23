import type { Article, Content } from "@pc-builder/shared/article";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ArticleStatus } from "@pc-builder/shared/article";
import { Products } from "@pc-builder/shared/part";

@Schema({ timestamps: true })
export class ArticleClass implements Omit<Article, "id"> {
  declare _id: string;

  declare __v: number;

  @Prop({ type: String, required: true, unique: true, index: true })
  declare slug: string;

  @Prop({ type: [{ type: String }], index: true })
  declare topic?: string;

  @Prop({
    type: [{ type: String, enum: Object.values(Products) }],
    index: true,
  })
  declare part?: Products;

  @Prop({ type: String, required: true })
  declare title: string;

  @Prop({ type: String, required: true, default: "admin" })
  declare author: string;

  @Prop({ type: String, required: true })
  declare standfirst: string;

  @Prop({ type: String })
  declare cover?: string;

  @Prop({ type: String })
  declare icon?: string;

  @Prop({ type: [{ type: Object }], default: [] })
  declare content: Content[];

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.Draft,
    index: true,
  })
  declare status: ArticleStatus;

  @Prop({ type: Number, default: 0 })
  declare views: number;

  @Prop({ type: Date })
  declare publishedAt?: Date;

  declare createdAt: Date;

  declare updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleClass);
