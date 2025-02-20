import { string, z } from "zod";
import { Primitive } from "../utils";

namespace Article {
  export type Content = Paragraph | Image | List | Section;

  export const ContentArray = z.lazy(() =>
    z.union([Section, List, Paragraph, Image]).array()
  );

  export type Section = {
    type: "section";
    title: string;
    content: Content[];
  };

  export const Section: z.ZodType<Section> = z
    .object({
      type: z.literal("section"),
      title: Primitive.String,
    })
    .extend({
      content: ContentArray,
    });

  export type List = {
    type: "list";
    symbol: string;
    content: Content[];
  };

  export const List: z.ZodType<List> = z
    .object({
      type: z.literal("list"),
      symbol: Primitive.String,
    })
    .extend({
      content: ContentArray,
    });

  export type Image = z.infer<typeof Image>;

  export const Image = z.object({
    type: z.literal("image"),
    src: Primitive.String,
    alt: Primitive.String.optional(),
    caption: Primitive.String,
  });

  export type Paragraph = z.infer<typeof Paragraph>;

  export const Paragraph = z.object({
    type: z.literal("paragraph"),
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
