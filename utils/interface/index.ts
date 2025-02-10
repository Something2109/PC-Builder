import { z } from "zod";
import { Infos } from "../Enum";
import AIO from "./info/AIO";
import Case from "./info/Case";
import Cooler from "./info/Cooler";
import CPU from "./info/CPU";
import Fan from "./info/Fan";
import GPU from "./info/GPU";
import GraphicCard from "./info/GraphicCard";
import HDD from "./info/HDD";
import Mainboard from "./info/Mainboard";
import Part from "./info/Parts";
import PSU from "./info/PSU";
import RAM from "./info/RAM";
import SSD from "./info/SSD";
import CPUBlock from "./info/CPUBlock";
import Pump from "./info/Pump";
import Radiator from "./info/Radiator";
import { Primitive } from "./utils";

/**
 * DECLARE THE INFORMATION AND FILTER OBJECT OF EACH PRODUCT AND PRODUCT TYPE
 * THAT TO BE USED IN ALL PART OF THE PROJECT.
 */

/**
 * The summary information of a specific product.
 * Contains the most important information of the product from each {@link Infos} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const SummaryInfo = Part.SummarySchema.merge(
  z
    .object({
      [Infos.CPU]: CPU.SummarySchema,
      [Infos.GPU]: GPU.SummarySchema,
      [Infos.GRAPHIC_CARD]: GraphicCard.SummarySchema,
      [Infos.MAIN]: Mainboard.SummarySchema,
      [Infos.RAM]: RAM.SummarySchema,
      [Infos.SSD]: SSD.SummarySchema,
      [Infos.HDD]: HDD.SummarySchema,
      [Infos.PSU]: PSU.SummarySchema,
      [Infos.CASE]: Case.SummarySchema,
      [Infos.FAN]: Fan.SummarySchema,
      [Infos.COOLER]: Cooler.SummarySchema,
      [Infos.AIO]: AIO.SummarySchema,
      [Infos.CPU_BLOCK]: CPUBlock.SummarySchema,
      [Infos.PUMP]: Pump.SummarySchema,
      [Infos.RADIATOR]: Radiator.SummarySchema,
    })
    .partial()
);

export type SummaryInfo = z.infer<typeof SummaryInfo>;

/**
 * The detail information of a specific product.
 * Contains the most detailed information of the product from each {@link Infos} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const DetailInfo = Part.Schema.merge(
  z
    .object({
      raw: Primitive.String,
      [Infos.CPU]: CPU.Schema.partial().nullish(),
      [Infos.GPU]: GPU.Schema.partial().nullish(),
      [Infos.GRAPHIC_CARD]: GraphicCard.Schema.partial().nullish(),
      [Infos.MAIN]: Mainboard.Schema.partial().nullish(),
      [Infos.RAM]: RAM.Schema.partial().nullish(),
      [Infos.SSD]: SSD.Schema.partial().nullish(),
      [Infos.HDD]: HDD.Schema.partial().nullish(),
      [Infos.PSU]: PSU.Schema.partial().nullish(),
      [Infos.CASE]: Case.Schema.partial().nullish(),
      [Infos.FAN]: Fan.Schema.partial().nullish(),
      [Infos.COOLER]: Cooler.Schema.partial().nullish(),
      [Infos.AIO]: AIO.Schema.partial().nullish(),
      [Infos.CPU_BLOCK]: CPUBlock.Schema.partial().nullish(),
      [Infos.PUMP]: Pump.Schema.partial().nullish(),
      [Infos.RADIATOR]: Radiator.Schema.partial().nullish(),
    })
    .partial()
);

export type DetailInfo = z.infer<typeof DetailInfo>;

/**
 * The filter options of the information.
 * Contains the filter options of each {@link Infos} type combined into one object.
 * This object is used to pass the filter conditions of the user to each {@link Infos} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const FilterOptions = z
  .object({
    part: Part.FilterOptionSchema,
    [Infos.CPU]: CPU.FilterOptionSchema.nullish(),
    [Infos.GPU]: GPU.FilterOptionSchema.nullish(),
    [Infos.GRAPHIC_CARD]: GraphicCard.FilterOptionSchema.nullish(),
    [Infos.MAIN]: Mainboard.FilterOptionSchema.nullish(),
    [Infos.RAM]: RAM.FilterOptionSchema.nullish(),
    [Infos.SSD]: SSD.FilterOptionSchema.nullish(),
    [Infos.HDD]: HDD.FilterOptionSchema.nullish(),
    [Infos.PSU]: PSU.FilterOptionSchema.nullish(),
    [Infos.CASE]: Case.FilterOptionSchema.nullish(),
    [Infos.FAN]: Fan.FilterOptionSchema.nullish(),
    [Infos.COOLER]: Cooler.FilterOptionSchema.nullish(),
    [Infos.AIO]: AIO.FilterOptionSchema.nullish(),
    [Infos.CPU_BLOCK]: CPUBlock.FilterOptionSchema.nullish(),
    [Infos.PUMP]: Pump.FilterOptionSchema.nullish(),
    [Infos.RADIATOR]: Radiator.FilterOptionSchema.nullish(),
  })
  .partial();

export type FilterOptions = z.infer<typeof FilterOptions>;
