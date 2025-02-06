import { FilterOptions, Primitive } from "../utils";
import { z } from "zod";

namespace Part {
  export const Schema = z.object({
    id: Primitive.String,

    part: Primitive.String,
    name: Primitive.String,
    code_name: Primitive.String,
    brand: Primitive.String,
    series: Primitive.String,

    launch_date: z.coerce.date().nullable().optional(),
    url: Primitive.String.url().nullable().optional(),
    image_url: Primitive.String.url().nullable().optional(),
  });

  export type BasicInfo = z.infer<typeof Schema>;

  export const Label: { [key in keyof BasicInfo]: string } = {
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

  export const SummarySchema = Schema.pick({
    id: true,
    part: true,
    name: true,
    brand: true,
    series: true,
    image_url: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      part: FilterOptions(Primitive.String),
      brand: FilterOptions(Primitive.String),
      series: FilterOptions(Primitive.String),
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Part;
