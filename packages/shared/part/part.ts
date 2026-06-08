import { z } from "zod";

import { Primitive } from "../interface";
import { createDTO, createModel, FilterOptions } from "../utils";
import * as Information from "./info";
import * as Product from "./product";

export * as Infer from "./infer";

export const BasicInfo = z.object({
  id: Primitive.String,

  part: z.nativeEnum(Product.Name),
  name: Primitive.String,
  code_name: Primitive.String,
  brand: Primitive.String,
  series: Primitive.String,

  launch_date: z.coerce.date(),
  url: Primitive.String.url(),
  image_url: Primitive.String.url(),
});

export type BasicInfo = z.infer<typeof BasicInfo>;

export const Label: { [key in Required<keyof BasicInfo>]: string } = {
  id: "ID",
  part: "Product Type",
  name: "Name",
  code_name: "Code Name",
  brand: "Brand",
  series: "Series",

  launch_date: "Launch Date",
  url: "Brand URL",
  image_url: "Image URL",
};

const BasicSummarySchema = BasicInfo.pick({
  id: true,
  part: true,
  name: true,
  brand: true,
  series: true,
  image_url: true,
});

const BasicFilterSchema = z
  .object({
    id: FilterOptions(Primitive.String),
    part: FilterOptions(Primitive.String),
    name: FilterOptions(Primitive.String),
    code_name: FilterOptions(Primitive.String),
    brand: FilterOptions(Primitive.String),
    series: FilterOptions(Primitive.String),

    launch_date: FilterOptions(Primitive.String),
    url: FilterOptions(Primitive.String),
    image_url: FilterOptions(Primitive.String),
  })
  .partial();

export const BasicAttributes = BasicInfo.keyof();

export type BasicAttributes = z.infer<typeof BasicAttributes>;

export const BasicSummaryAttributes = BasicSummarySchema.keyof().options;

export const BasicFilterAttributes = BasicFilterSchema.pick({
  part: true,
  brand: true,
  series: true,
}).keyof().options;

export type Summary<product extends Product.Name | undefined = undefined> =
  product extends Product.Name
    ? z.infer<typeof BasicSummarySchema> &
        z.infer<(typeof Product.Summary)[product]>
    : z.infer<typeof BasicSummarySchema>;

export type Filter = {
  part?: z.infer<typeof BasicFilterSchema>;
} & {
  [key in Information.Name]?: Record<string, string[] | number[]> | null;
};

export const Model = createModel(BasicInfo, ["id", "name", "code_name"]).merge(
  z.object(Information.Model)
);

export type Model = z.infer<typeof Model>;

export const DTO = createDTO(BasicInfo.omit({ id: true }), [
  "name",
  "code_name",
]).merge(z.object(Information.DTO).partial());

export type DTO = z.infer<typeof DTO>;

export type Infer<
  I extends Information.Name,
  A extends string = ""
> = A extends "" ? Infer.InfoType<I> : Infer.AttributeType<I, A>;
