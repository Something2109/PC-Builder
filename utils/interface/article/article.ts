import { string, z } from "zod";
import { Primitive } from "../utils";

namespace Article {
  export enum ContentName {
    Paragraph = "paragraph",
    Image = "image",
    List = "list",
    Section = "section",
  }

  export type Content = Paragraph | Image | List | Section;

  export const ContentArray = z.lazy(() =>
    z.union([Section, List, Paragraph, Image]).array()
  );

  export type Section = {
    type: ContentName.Section;
    title: string;
    content: Content[];
  };

  export const Section: z.ZodType<Section> = z
    .object({
      type: z.literal(ContentName.Section),
      title: Primitive.String,
    })
    .extend({
      content: ContentArray,
    });

  export type List = {
    type: ContentName.List;
    symbol: string;
    content: Content[];
  };

  export const List: z.ZodType<List> = z
    .object({
      type: z.literal(ContentName.List),
      symbol: Primitive.String,
    })
    .extend({
      content: ContentArray,
    });

  export type Image = z.infer<typeof Image>;

  export const Image = z.object({
    type: z.literal(ContentName.Image),
    src: Primitive.String,
    alt: Primitive.String.optional(),
    caption: Primitive.String,
  });

  export type Paragraph = z.infer<typeof Paragraph>;

  export const Paragraph = z.object({
    type: z.literal(ContentName.Paragraph),
    content: Primitive.String,
  });

  export const Schema = z.object({
    id: Primitive.String,
    title: Primitive.String,
    author: Primitive.String,
    standfirst: Primitive.String,
    createdAt: z.coerce.date(),
    content: ContentArray,
  });

  export type Type = z.infer<typeof Schema>;

  export const Summary = Schema.omit({ content: true });

  export type Summary = z.infer<typeof Summary>;
}

export { Article };
