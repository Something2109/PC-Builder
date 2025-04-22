import { Infos, Products } from "../../Enum";
import { FilterOptions, Primitive } from "../utils";
import { z } from "zod";
import { Product } from "./product";
import { Mapping } from "./mapping";
import { Information } from "./info";

namespace Part {
  export const BasicInfo = z.object({
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

  export type BasicInfo = z.infer<typeof BasicInfo>;

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
      part: FilterOptions(Primitive.String),
      brand: FilterOptions(Primitive.String),
      series: FilterOptions(Primitive.String),
    })
    .partial();

  export const BasicSummaryAttributes = BasicSummarySchema.keyof().options;

  export const BasicFilterAttributes = BasicFilterSchema.keyof().options;

  export type Summary<product extends Products | undefined = undefined> =
    product extends Products
      ? z.infer<typeof BasicSummarySchema> &
          z.infer<(typeof Product.Summary)[product]>
      : z.infer<typeof BasicSummarySchema>;

  export type Filter = {
    part?: z.infer<typeof BasicFilterSchema>;
  } & {
    [key in Infos]?: Record<string, string[] | number[]> | null;
  };

  export const Detail = Part.BasicInfo.merge(
    z.object(Information.Detail).partial()
  );

  export type Detail = z.infer<typeof Detail>;
}

export default Part;

export { Product, Information, Mapping };
