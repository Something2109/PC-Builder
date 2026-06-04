import { z } from "zod";
import { Primitive } from "../interface";

export enum ContentName {
  Paragraph = "paragraph",
  Image = "image",
  List = "list",
  Section = "section",
}

export enum ArticleStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
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
  slug: z.string().min(3),
  title: Primitive.String.min(3, "Title must be at least 3 characters"),
  author: Primitive.String,
  standfirst: Primitive.String,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  content: ContentArray,
  cover: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(ArticleStatus).default(ArticleStatus.Draft),
  topic: z.string().optional(),
  part: z.string().optional(),
  views: z.number().default(0),
});

export type Article = z.infer<typeof Article>;

export const Summary = Article.omit({ content: true });

export type Summary = z.infer<typeof Summary>;

// Schemas for API Requests with automatic slugify transformations
export const BaseEditArticleDto = Article.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
}).partial({
  slug: true,
  status: true,
  cover: true,
  icon: true,
});

export const CreateArticleDto = BaseEditArticleDto.transform((data) => {
  return {
    ...data,
    slug: slugify(data.slug || data.title),
  };
});

export type CreateArticleDto = z.infer<typeof CreateArticleDto>;

export const UpdateArticleDto = BaseEditArticleDto.partial().transform(
  (data) => {
    const result = { ...data };
    if (data.slug) {
      result.slug = slugify(data.slug);
    } else if (data.title) {
      result.slug = slugify(data.title);
    }
    return result;
  },
);

export type UpdateArticleDto = z.infer<typeof UpdateArticleDto>;
