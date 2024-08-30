type ContentType = ParagraphType | ImageType | ListType | SectionType;

type ContentContainer = {
  content: Array<ContentType>;
};

type ArticleType = SectionType & {
  author: string;
  standfirst: string;
  createdAt: Date;
};

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
  caption: string;
};

type ParagraphType = {
  type: "paragraph";
  content: string;
};

export type {
  ArticleType,
  SectionType,
  ImageType,
  ListType,
  ContentType,
  ParagraphType,
};
