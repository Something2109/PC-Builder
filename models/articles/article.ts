import { ArticleType, ContentType } from "@/utils/interface/article/article";
import { Tables } from "../interface";
import {
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ modelName: Tables.ARTICLE })
export class Article extends Model implements Omit<ArticleType, "type"> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare topic: string;

  @PrimaryKey
  @Column(DataType.STRING)
  declare part: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Default("admin")
  @Column(DataType.STRING)
  declare author: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare standfirst: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.TEXT)
  set content(val: ContentType[]) {
    this.setDataValue("content", JSON.stringify(val));
  }

  get content(): ContentType[] {
    const data = this.getDataValue("content");
    return JSON.parse(data);
  }
}
