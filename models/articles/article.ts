type ContentType = string | ImageType | ListType | SectionType;

enum ArticleComponentType {
  SECTION = "section",
  PARAGRAPH = "paragraph",
  IMAGE = "image",
  LIST = "list",
}

type ArticleComponent = {
  type: ArticleComponentType;
};

type ContentContainer = {
  content: Array<ContentType>;
};

type ArticleType = SectionType & {
  author: string;
  createdAt: Date;
};

type SectionType = {
  title: string;
} & ContentContainer;

type ImageType = ArticleComponent & {
  type: ArticleComponentType.IMAGE;
  src: string;
  alt?: string;
  caption: string;
};

type ListType = {
  symbol: string;
} & ContentContainer;

export type { ArticleType, SectionType, ImageType, ListType, ContentType };
