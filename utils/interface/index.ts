import { z } from "zod";
import { Info } from "../Enum";
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
 * Contains the most important information of the product from each {@link Info} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const SummaryInfo = Part.SummarySchema.merge(
  z
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
    .partial()
);

export type SummaryInfo = z.infer<typeof SummaryInfo>;

/**
 * The detail information of a specific product.
 * Contains the most detailed information of the product from each {@link Info} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const DetailInfo = Part.Schema.merge(
  z
    .object({
      raw: Primitive.String,
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

export type DetailInfo = z.infer<typeof DetailInfo>;

/**
 * The filter options of the information.
 * Contains the filter options of each {@link Info} type combined into one object.
 * This object is used to pass the filter conditions of the user to each {@link Info} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const FilterOptions = z
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

export type FilterOptions = z.infer<typeof FilterOptions>;
