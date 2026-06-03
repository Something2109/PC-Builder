import { z } from "zod";
import { Primitive } from "../interface";

export enum ContentName {
  Paragraph = "paragraph",
  Image = "image",
  List = "list",
  Section = "section",
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const IdSchema = z.preprocess(
  (val) => (typeof val === "string" && val.trim() ? val : generateId()),
  z.string(),
);

export const BaseContentSchema = z.object({
  id: IdSchema,
  type: z.enum(ContentName),
});

export const ContentArray: z.ZodType<Content[], z.ZodType, any> = z.lazy(() =>
  z.union([Section, List, Paragraph, Image]).array(),
);

export type Section = {
  id: string;
  type: ContentName.Section;
  title: string;
  content: Content[];
};

export const Section: z.ZodType<Section, z.ZodType, any> =
  BaseContentSchema.extend({
    type: z.literal(ContentName.Section),
    title: Primitive.String,
    content: ContentArray,
  });

export type List = {
  id: string;
  type: ContentName.List;
  symbol: string;
  content: Content[];
};

export const List: z.ZodType<List, z.ZodType, any> = BaseContentSchema.extend({
  type: z.literal(ContentName.List),
  symbol: Primitive.String,
  content: ContentArray,
});

export type Image = z.infer<typeof Image>;

export const Image = BaseContentSchema.extend({
  type: z.literal(ContentName.Image),
  src: Primitive.String,
  alt: Primitive.String.optional(),
  caption: Primitive.String,
});

export type Paragraph = z.infer<typeof Paragraph>;

export const Paragraph = BaseContentSchema.extend({
  type: z.literal(ContentName.Paragraph),
  content: Primitive.String,
});

export type Content = Paragraph | Image | List | Section;

export const Content = z.union([Section, List, Paragraph, Image]);

export const Article = z.object({
  id: Primitive.String,
  title: Primitive.String,
  author: Primitive.String,
  standfirst: Primitive.String,
  createdAt: z.coerce.date(),
  content: ContentArray,
  cover: z.string().optional(),
  icon: z.string().optional(),
});

export type Article = z.infer<typeof Article>;

export const Summary = Article.omit({ content: true });

export type Summary = z.infer<typeof Summary>;

export function normalizeArticle(article: any): Article {
  return Article.parse(article);
}
