import { z } from "zod";
import { Info, Products } from "../Enum";
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
    [Info.CPU]: CPU.SummarySchema,
    [Info.GPU]: GPU.SummarySchema,
    [Info.GRAPHIC_CARD]: GraphicCard.SummarySchema,
    [Info.MAIN]: Mainboard.SummarySchema,
    [Info.RAM]: RAM.SummarySchema,
    [Info.SSD]: SSD.SummarySchema,
    [Info.HDD]: HDD.SummarySchema,
    [Info.PSU]: PSU.SummarySchema,
    [Info.CASE]: Case.SummarySchema,
    [Info.FAN]: Fan.SummarySchema,
    [Info.COOLER]: Cooler.SummarySchema,
    [Info.AIO]: AIO.SummarySchema,
    [Info.CPU_BLOCK]: CPUBlock.SummarySchema,
    [Info.PUMP]: Pump.SummarySchema,
    [Info.RADIATOR]: Radiator.SummarySchema,
  })
  .partial();

export type SummaryInfo<T extends Info> = z.infer<typeof Part.SummarySchema> & {
  [key in T]: z.infer<typeof PartSummaryInfoSchema>[T];
};

export const DetailInfoListSchema = z
  .object({
    [Info.CPU]: CPU.Schema,
    [Info.GPU]: GPU.Schema,
    [Info.GRAPHIC_CARD]: GraphicCard.Schema,
    [Info.MAIN]: Mainboard.Schema,
    [Info.RAM]: RAM.Schema,
    [Info.SSD]: SSD.Schema,
    [Info.HDD]: HDD.Schema,
    [Info.PSU]: PSU.Schema,
    [Info.CASE]: Case.Schema,
    [Info.FAN]: Fan.Schema,
    [Info.COOLER]: Cooler.Schema,
    [Info.AIO]: AIO.Schema,
    [Info.CPU_BLOCK]: CPUBlock.Schema,
    [Info.PUMP]: Pump.Schema,
    [Info.RADIATOR]: Radiator.Schema,
  })
  .partial();

export type DetailInfo<T extends Info> = z.infer<typeof Part.Schema> & {
  raw?: string;
} & {
  [key in T]: z.infer<typeof DetailInfoListSchema>[T];
};

export const DetailInfoOptionsSchema = Part.Schema.partial().merge(
  z
    .object({
      raw: z.string(),
      [Info.CPU]: CPU.Schema.partial().nullish(),
      [Info.GPU]: GPU.Schema.partial().nullish(),
      [Info.GRAPHIC_CARD]: GraphicCard.Schema.partial().nullish(),
      [Info.MAIN]: Mainboard.Schema.partial().nullish(),
      [Info.RAM]: RAM.Schema.partial().nullish(),
      [Info.SSD]: SSD.Schema.partial().nullish(),
      [Info.HDD]: HDD.Schema.partial().nullish(),
      [Info.PSU]: PSU.Schema.partial().nullish(),
      [Info.CASE]: Case.Schema.partial().nullish(),
      [Info.FAN]: Fan.Schema.partial().nullish(),
      [Info.COOLER]: Cooler.Schema.partial().nullish(),
      [Info.AIO]: AIO.Schema.partial().nullish(),
      [Info.CPU_BLOCK]: CPUBlock.Schema.partial().nullish(),
      [Info.PUMP]: Pump.Schema.partial().nullish(),
      [Info.RADIATOR]: Radiator.Schema.partial().nullish(),
    })
    .partial()
);

export type DetailInfoOptions = z.infer<typeof DetailInfoOptionsSchema>;

export const ProductInfo: { [key in Products]: Info[] } = {
  [Products.CPU]: [Info.CPU, Info.GPU],
  [Products.GPU]: [Info.GPU],
  [Products.GRAPHIC_CARD]: [Info.GRAPHIC_CARD],
  [Products.MAIN]: [Info.MAIN],
  [Products.RAM]: [Info.RAM],
  [Products.SSD]: [Info.SSD],
  [Products.HDD]: [Info.HDD],
  [Products.PSU]: [Info.PSU],
  [Products.CASE]: [Info.CASE],
  [Products.FAN]: [Info.FAN],
  [Products.COOLER]: [Info.COOLER],
  [Products.AIO]: [Info.AIO],
  [Products.CPU_BLOCK]: [Info.CPU_BLOCK],
  [Products.PUMP]: [Info.PUMP],
  [Products.RADIATOR]: [Info.RADIATOR],
};

export const FilterOptionSchema = z
  .object({
    part: Part.FilterOptionSchema,
    [Info.CPU]: CPU.FilterOptionSchema.nullish(),
    [Info.GPU]: GPU.FilterOptionSchema.nullish(),
    [Info.GRAPHIC_CARD]: GraphicCard.FilterOptionSchema.nullish(),
    [Info.MAIN]: Mainboard.FilterOptionSchema.nullish(),
    [Info.RAM]: RAM.FilterOptionSchema.nullish(),
    [Info.SSD]: SSD.FilterOptionSchema.nullish(),
    [Info.HDD]: HDD.FilterOptionSchema.nullish(),
    [Info.PSU]: PSU.FilterOptionSchema.nullish(),
    [Info.CASE]: Case.FilterOptionSchema.nullish(),
    [Info.FAN]: Fan.FilterOptionSchema.nullish(),
    [Info.COOLER]: Cooler.FilterOptionSchema.nullish(),
    [Info.AIO]: AIO.FilterOptionSchema.nullish(),
    [Info.CPU_BLOCK]: CPUBlock.FilterOptionSchema.nullish(),
    [Info.PUMP]: Pump.FilterOptionSchema.nullish(),
    [Info.RADIATOR]: Radiator.FilterOptionSchema.nullish(),
  })
  .partial();

export type FilterOptions = z.infer<typeof FilterOptionSchema>;

export const FilterAttributes = {
  part: Part.FilterAttributes,
  [Info.CPU]: CPU.FilterAttributes,
  [Info.GPU]: GPU.FilterAttributes,
  [Info.GRAPHIC_CARD]: GraphicCard.FilterAttributes,
  [Info.MAIN]: Mainboard.FilterAttributes,
  [Info.RAM]: RAM.FilterAttributes,
  [Info.SSD]: SSD.FilterAttributes,
  [Info.HDD]: HDD.FilterAttributes,
  [Info.PSU]: PSU.FilterAttributes,
  [Info.CASE]: Case.FilterAttributes,
  [Info.FAN]: Fan.FilterAttributes,
  [Info.COOLER]: Cooler.FilterAttributes,
  [Info.AIO]: AIO.FilterAttributes,
  [Info.CPU_BLOCK]: CPUBlock.FilterAttributes,
  [Info.PUMP]: Pump.FilterAttributes,
  [Info.RADIATOR]: Radiator.FilterAttributes,
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
