import {
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Article, Content, ArticleStatus } from "@/utils/article";

import { Tables } from "../interface";

@Table({ modelName: Tables.ARTICLE })
export default class ArticleModel extends Model implements Omit<Article, "id"> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare topic: string;

  @PrimaryKey
  @Column(DataType.STRING)
  declare part: string;

  @NotNull
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare slug: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Default("admin")
  @Column(DataType.STRING)
  declare author: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare standfirst: string;

  @Column(DataType.STRING)
  declare cover?: string;

  @Column(DataType.STRING)
  declare icon?: string;

  @Default(ArticleStatus.Draft)
  @Column({
    type: DataType.ENUM(...Object.values(ArticleStatus)),
    allowNull: false,
  })
  declare status: ArticleStatus;

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare views: number;

  @Column(DataType.DATE)
  declare publishedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @Column(DataType.TEXT)
  set content(val: Content[]) {
    this.setDataValue("content", JSON.stringify(val));
  }

  get content(): Content[] {
    const data = this.getDataValue("content");
    return JSON.parse(data);
  }
}
