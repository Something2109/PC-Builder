import { FilterOptions } from "../utils";
import { z } from "zod";

namespace Part {
  export const Schema = z.object({
    id: z.string(),

    part: z.string(),
    name: z.string(),
    code_name: z.string(),
    brand: z.string(),
    series: z.string(),

    launch_date: z.date().nullable().optional(),
    url: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
  });

  export type BasicInfo = z.infer<typeof Schema>;

  export const Label: { [key in keyof BasicInfo]: string } = {
    id: "ID",
    part: "Product Type",
    name: "Name",
    code_name: "Code Name",
    brand: "Brand",
    series: "Series",
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
      part: FilterOptions(z.string()),
      brand: FilterOptions(z.string()),
      series: FilterOptions(z.string()),
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Part;
