import { z } from "zod";
import { Products } from "../Enum";
import AIO from "./part/AIO";
import Case from "./part/Case";
import Cooler from "./part/Cooler";
import CPU from "./part/CPU";
import Fan from "./part/Fan";
import GPU from "./part/GPU";
import GraphicCard from "./part/GraphicCard";
import HDD from "./part/HDD";
import Mainboard from "./part/Mainboard";
import Part from "./part/Parts";
import PSU from "./part/PSU";
import RAM from "./part/RAM";
import SSD from "./part/SSD";

export const PartSummaryInfoSchema = z
  .object({
    [Products.CPU]: CPU.SummarySchema,
    [Products.GPU]: GPU.SummarySchema,
    [Products.GRAPHIC_CARD]: GraphicCard.SummarySchema,
    [Products.MAIN]: Mainboard.SummarySchema,
    [Products.RAM]: RAM.SummarySchema,
    [Products.SSD]: SSD.SummarySchema,
    [Products.HDD]: HDD.SummarySchema,
    [Products.PSU]: PSU.SummarySchema,
    [Products.CASE]: Case.SummarySchema,
    [Products.FAN]: Fan.SummarySchema,
    [Products.COOLER]: Cooler.SummarySchema,
    [Products.AIO]: AIO.SummarySchema,
  })
  .partial();

export type SummaryInfo<T extends Products> = z.infer<
  typeof Part.SummarySchema
> & {
  [key in T]: z.infer<typeof PartSummaryInfoSchema>[T];
};

export const DetailInfoListSchema = z
  .object({
    [Products.CPU]: CPU.Schema,
    [Products.GPU]: GPU.Schema,
    [Products.GRAPHIC_CARD]: GraphicCard.Schema,
    [Products.MAIN]: Mainboard.Schema,
    [Products.RAM]: RAM.Schema,
    [Products.SSD]: SSD.Schema,
    [Products.HDD]: HDD.Schema,
    [Products.PSU]: PSU.Schema,
    [Products.CASE]: Case.Schema,
    [Products.FAN]: Fan.Schema,
    [Products.COOLER]: Cooler.Schema,
    [Products.AIO]: AIO.Schema,
  })
  .partial();

export const DetailInfoOptionsSchema = Part.Schema.partial().merge(
  z
    .object({
      raw: z.string(),
      [Products.CPU]: CPU.Schema.partial(),
      [Products.GPU]: GPU.Schema.partial(),
      [Products.GRAPHIC_CARD]: GraphicCard.Schema.partial(),
      [Products.MAIN]: Mainboard.Schema.partial(),
      [Products.RAM]: RAM.Schema.partial(),
      [Products.SSD]: SSD.Schema.partial(),
      [Products.HDD]: HDD.Schema.partial(),
      [Products.PSU]: PSU.Schema.partial(),
      [Products.CASE]: Case.Schema.partial(),
      [Products.FAN]: Fan.Schema.partial(),
      [Products.COOLER]: Cooler.Schema.partial(),
      [Products.AIO]: AIO.Schema.partial(),
    })
    .partial()
);

export type DetailInfo<T extends Products> = z.infer<typeof Part.Schema> & {
  raw?: string;
} & {
  [key in T]: z.infer<typeof DetailInfoListSchema>[T];
};

export const FilterOptionSchema = z
  .object({
    part: Part.FilterOptionSchema,
    [Products.CPU]: CPU.FilterOptionSchema,
    [Products.GPU]: GPU.FilterOptionSchema,
    [Products.GRAPHIC_CARD]: GraphicCard.FilterOptionSchema,
    [Products.MAIN]: Mainboard.FilterOptionSchema,
    [Products.RAM]: RAM.FilterOptionSchema,
    [Products.SSD]: SSD.FilterOptionSchema,
    [Products.HDD]: HDD.FilterOptionSchema,
    [Products.PSU]: PSU.FilterOptionSchema,
    [Products.CASE]: Case.FilterOptionSchema,
    [Products.FAN]: Fan.FilterOptionSchema,
    [Products.COOLER]: Cooler.FilterOptionSchema,
    [Products.AIO]: AIO.FilterOptionSchema,
  })
  .partial();

export type FilterOptions = z.infer<typeof FilterOptionSchema>;

export const FilterAttributes = {
  part: Part.FilterAttributes,
  [Products.CPU]: CPU.FilterAttributes,
  [Products.GPU]: GPU.FilterAttributes,
  [Products.GRAPHIC_CARD]: GraphicCard.FilterAttributes,
  [Products.MAIN]: Mainboard.FilterAttributes,
  [Products.RAM]: RAM.FilterAttributes,
  [Products.SSD]: SSD.FilterAttributes,
  [Products.HDD]: HDD.FilterAttributes,
  [Products.PSU]: PSU.FilterAttributes,
  [Products.CASE]: Case.FilterAttributes,
  [Products.FAN]: Fan.FilterAttributes,
  [Products.COOLER]: Cooler.FilterAttributes,
  [Products.AIO]: AIO.FilterAttributes,
};

export const DefaultFilterOptions = {
  [Products.MAIN]: Mainboard.DefaultFilterOptions,
  [Products.RAM]: RAM.DefaultFilterOptions,
  [Products.SSD]: SSD.DefaultFilterOptions,
  [Products.HDD]: HDD.DefaultFilterOptions,
  [Products.PSU]: PSU.DefaultFilterOptions,
  [Products.CASE]: Case.DefaultFilterOptions,
  [Products.COOLER]: Cooler.DefaultFilterOptions,
  [Products.AIO]: AIO.DefaultFilterOptions,
  [Products.FAN]: Fan.DefaultFilterOptions,
};
