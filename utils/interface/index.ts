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
import CPUBlock from "./part/CPUBlock";
import Pump from "./part/Pump";
import Radiator from "./part/Radiator";

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
    [Products.CPU_BLOCK]: CPUBlock.SummarySchema,
    [Products.PUMP]: Pump.SummarySchema,
    [Products.RADIATOR]: Radiator.SummarySchema,
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
    [Products.CPU_BLOCK]: CPUBlock.Schema,
    [Products.PUMP]: Pump.Schema,
    [Products.RADIATOR]: Radiator.Schema,
  })
  .partial();

export type DetailInfo<T extends Products> = z.infer<typeof Part.Schema> & {
  raw?: string;
} & {
  [key in T]: z.infer<typeof DetailInfoListSchema>[T];
};

export const DetailInfoOptionsSchema = Part.Schema.partial().merge(
  z
    .object({
      raw: z.string(),
      [Products.CPU]: CPU.Schema.partial().nullish(),
      [Products.GPU]: GPU.Schema.partial().nullish(),
      [Products.GRAPHIC_CARD]: GraphicCard.Schema.partial().nullish(),
      [Products.MAIN]: Mainboard.Schema.partial().nullish(),
      [Products.RAM]: RAM.Schema.partial().nullish(),
      [Products.SSD]: SSD.Schema.partial().nullish(),
      [Products.HDD]: HDD.Schema.partial().nullish(),
      [Products.PSU]: PSU.Schema.partial().nullish(),
      [Products.CASE]: Case.Schema.partial().nullish(),
      [Products.FAN]: Fan.Schema.partial().nullish(),
      [Products.COOLER]: Cooler.Schema.partial().nullish(),
      [Products.AIO]: AIO.Schema.partial().nullish(),
      [Products.CPU_BLOCK]: CPUBlock.Schema.partial().nullish(),
      [Products.PUMP]: Pump.Schema.partial().nullish(),
      [Products.RADIATOR]: Radiator.Schema.partial().nullish(),
    })
    .partial()
);

export type DetailInfoOptions = z.infer<typeof DetailInfoOptionsSchema>;

export const FilterOptionSchema = z
  .object({
    part: Part.FilterOptionSchema,
    [Products.CPU]: CPU.FilterOptionSchema.nullish(),
    [Products.GPU]: GPU.FilterOptionSchema.nullish(),
    [Products.GRAPHIC_CARD]: GraphicCard.FilterOptionSchema.nullish(),
    [Products.MAIN]: Mainboard.FilterOptionSchema.nullish(),
    [Products.RAM]: RAM.FilterOptionSchema.nullish(),
    [Products.SSD]: SSD.FilterOptionSchema.nullish(),
    [Products.HDD]: HDD.FilterOptionSchema.nullish(),
    [Products.PSU]: PSU.FilterOptionSchema.nullish(),
    [Products.CASE]: Case.FilterOptionSchema.nullish(),
    [Products.FAN]: Fan.FilterOptionSchema.nullish(),
    [Products.COOLER]: Cooler.FilterOptionSchema.nullish(),
    [Products.AIO]: AIO.FilterOptionSchema.nullish(),
    [Products.CPU_BLOCK]: CPUBlock.FilterOptionSchema.nullish(),
    [Products.PUMP]: Pump.FilterOptionSchema.nullish(),
    [Products.RADIATOR]: Radiator.FilterOptionSchema.nullish(),
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
  [Products.CPU_BLOCK]: CPUBlock.FilterAttributes,
  [Products.PUMP]: Pump.FilterAttributes,
  [Products.RADIATOR]: Radiator.FilterAttributes,
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
  [Products.CPU_BLOCK]: CPUBlock.DefaultFilterOptions,
  [Products.PUMP]: Pump.DefaultFilterOptions,
  [Products.RADIATOR]: Radiator.DefaultFilterOptions,
};
