import { Type, Content } from "@/utils/article";
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
export class ArticleModel extends Model implements Omit<Type, "id"> {
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
  set content(val: Content[]) {
    this.setDataValue("content", JSON.stringify(val));
  }

  get content(): Content[] {
    const data = this.getDataValue("content");
    return JSON.parse(data);
  }
}
