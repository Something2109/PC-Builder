import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";

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

export class Article
  extends Model<InferAttributes<Article>, InferCreationAttributes<Article>>
  implements Omit<ArticleType, "type">
{
  declare topic: string;
  declare part: string;
  declare title: string;
  declare author: string;
  declare standfirst: string;
  declare createdAt: Date;
  declare content: ContentType[];

  declare content_json: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
}

Article.init(
  {
    topic: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    part: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    standfirst: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date(this.getDataValue("created_at"));
      },
    },
    content: {
      type: DataTypes.VIRTUAL,
      set(val: ContentType[]) {
        this.setDataValue("content_json", JSON.stringify(val));
      },
      get(): ContentType[] {
        const data = this.getDataValue("content_json");
        return JSON.parse(data);
      },
    },

    created_at: DataTypes.DATE,
    content_json: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { ...BaseModelOptions, modelName: Tables.ARTICLE }
);

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
