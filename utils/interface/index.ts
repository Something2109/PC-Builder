import { z, ZodSchema } from "zod";
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
import { FormFactor, InternalConnectors, Material, Primitive } from "./utils";

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

/**
 * The summary attribute list of the information.
 * Contains the attributes that are considered as the notable attributes of each {@link Info} type.
 */
export const SummaryAttributes: Record<Info, string[]> = {
  [Info.CPU]: CPU.SummaryAttributes,
  [Info.GPU]: GPU.SummaryAttributes,
  [Info.GRAPHIC_CARD]: GraphicCard.SummaryAttributes,
  [Info.MAIN]: Mainboard.SummaryAttributes,
  [Info.RAM]: RAM.SummaryAttributes,
  [Info.SSD]: SSD.SummaryAttributes,
  [Info.HDD]: HDD.SummaryAttributes,
  [Info.PSU]: PSU.SummaryAttributes,
  [Info.CASE]: Case.SummaryAttributes,
  [Info.FAN]: Fan.SummaryAttributes,
  [Info.COOLER]: Cooler.SummaryAttributes,
  [Info.AIO]: AIO.SummaryAttributes,
  [Info.CPU_BLOCK]: CPUBlock.SummaryAttributes,
  [Info.PUMP]: Pump.SummaryAttributes,
  [Info.RADIATOR]: Radiator.SummaryAttributes,
};

/**
 * The filter attribute list of the information.
 * Contains the attributes that can be used as filter in each {@link Info} type.
 */
export const FilterAttributes: Record<Info, string[]> = {
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

/**
 * DECLARE THE PRODUCT RELATED MAPPING AND FILTER.
 */

/**
 * The mapping from the {@link Products} to the {@link Info} type.
 * Contains all the {@link Info} that a {@link Products} type can have.
 */
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

/**
 * The product filter options of each {@link Products} type.
 * Contains the attributes and the schema to verify the corresponsding value.
 * This is used to declare and verify the attributes of the product.
 * The attributes here can be different from {@link Info} filter options
 * and the mapping between the two should be defined in more specific implementation.
 */
export const ProductFilterOptions: {
  [key in Products]: Record<string, ZodSchema>;
} = {
  [Products.CPU]: {
    socket: Primitive.String,
    total_cores: Primitive.Number,
    total_threads: Primitive.Number,
    base_frequency: Primitive.Number,
    turbo_frequency: Primitive.Number,
    L3_cache: Primitive.Number,
    tdp: Primitive.Number,
  },
  [Products.GPU]: {
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,
    memory_size: Primitive.Number,
    memory_type: Primitive.String,
    tdp: Primitive.Number,
  },
  [Products.GRAPHIC_CARD]: {
    length: Primitive.Number,
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,
    width: Primitive.Number,
    height: Primitive.Number,
    minimum_psu: Primitive.Number,
  },
  [Products.MAIN]: {
    socket: Primitive.String,
    form_factor: FormFactor.Mainboard,
    ram_form_factor: FormFactor.RAM,
    ram_interface: FormFactor.RAM,
  },
  [Products.RAM]: {
    form_factor: FormFactor.RAM,
    capacity: Primitive.Number,
    interface: InternalConnectors.RAM,
  },
  [Products.SSD]: {
    memory_type: SSD.MemoryCell,
    form_factor: FormFactor.SSD,
    capacity: Primitive.Number,
    interface: InternalConnectors.Storage.SSD,
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
  },
  [Products.HDD]: {
    form_factor: FormFactor.HDD,
    capacity: Primitive.Number,
    interface: InternalConnectors.Storage.HDD,
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
    rotational_speed: Primitive.Number,
  },
  [Products.PSU]: {
    form_factor: FormFactor.PSU,
    wattage: Primitive.Number,
    efficiency: Primitive.Number,
    modular: PSU.Modular,
  },
  [Products.CASE]: {
    form_factor: FormFactor.Case,
    mainboard_support: FormFactor.Mainboard,
    radiator_support: FormFactor.Radiator,
    psu_support: FormFactor.PSU,
  },
  [Products.COOLER]: {
    socket: Primitive.String,
    cpu_plate: Material.Metal,
  },
  [Products.AIO]: {
    socket: Primitive.String,
    form_factor: FormFactor.Radiator,
    cpu_plate: Material.Metal,
  },
  [Products.FAN]: {
    form_factor: FormFactor.Fan,
    bearing: Fan.Bearing,
  },
  [Products.CPU_BLOCK]: {
    socket: Primitive.String,
    plate: Material.Metal,
  },
  [Products.PUMP]: {
    form_factor: FormFactor.Pump,
    flow_rate: Primitive.Number,
  },
  [Products.RADIATOR]: {
    form_factor: FormFactor.Radiator,
    material: Material.Metal,
  },
};
