import { BaseModelOptions, Tables } from "../interface";
import {
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

type ContentType = ParagraphType | ImageType | ListType | SectionType;

type ArticleSummary = {
  url: string;
  title: string;
  author: string;
  standfirst: string;
  createdAt: Date;
};

type ContentContainer = {
  content: Array<ContentType>;
};

type ArticleType = {
  type: "article";
} & Omit<ArticleSummary, "url"> &
  ContentContainer;

type SectionType = {
  type: "section";
  title: string;
} & ContentContainer;

type ListType = {
  type: "list";
  symbol: string;
} & ContentContainer;

type ImageType = {
  type: "image";
  src: string;
  alt?: string;
  image?: string;
  initial?: string;
  caption: string;
};

type ParagraphType = {
  type: "paragraph";
  content: string;
};

@Table({ ...BaseModelOptions, modelName: Tables.ARTICLE })
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

export class ValidateArticle {
  private static isContentContainer(content: any): content is ContentContainer {
    return (
      content &&
      typeof content === "object" &&
      "content" in content &&
      Array.isArray(content.content)
    );
  }

  static isArticle(content: any): content is ArticleType {
    return (
      content &&
      typeof content === "object" &&
      typeof content.type === "string" &&
      content.type === "article" &&
      typeof content.title === "string" &&
      typeof content.standfirst === "string" &&
      this.isContentContainer(content)
    );
  }

  static isContent(content: any): content is ContentType {
    if (!content || !content.type || typeof content.type !== "string") {
      return false;
    }
    switch (content.type) {
      case "section":
        return this.isSection(content);
      case "list":
        return this.isList(content);
      case "paragraph":
        return this.isParagraph(content);
      case "image":
        return this.isImage(content);
    }

    return false;
  }

  static isSection(content: any): content is SectionType {
    return (
      content &&
      typeof content === "object" &&
      typeof content.type === "string" &&
      content.type === "section" &&
      typeof content.title === "string" &&
      this.isContentContainer(content)
    );
  }

  static isList(content: any): content is SectionType {
    return (
      content &&
      typeof content === "object" &&
      typeof content.type === "string" &&
      content.type === "list" &&
      typeof content.symbol === "string" &&
      this.isContentContainer(content)
    );
  }

  static isParagraph(content: any): content is ParagraphType {
    return (
      content &&
      typeof content === "object" &&
      typeof content.type === "string" &&
      content.type === "paragraph" &&
      typeof content.content === "string"
    );
  }

  static isImage(content: any): content is ImageType {
    return (
      content &&
      typeof content === "object" &&
      typeof content.type === "string" &&
      content.type === "image" &&
      typeof content.src === "string" &&
      typeof content.caption === "string"
    );
  }
}

export type {
  ArticleSummary,
  ArticleType,
  SectionType,
  ImageType,
  ListType,
  ContentType,
  ParagraphType,
};
