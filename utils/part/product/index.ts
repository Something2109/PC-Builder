import { ZodObject, ZodSchema } from "zod";
import * as AIOProduct from "./AIO";
import * as CaseProduct from "./Case";
import * as CoolerProduct from "./Cooler";
import * as CPUProduct from "./CPU";
import * as FanProduct from "./Fan";
import * as GPUProduct from "./GPU";
import * as GraphicCard from "./GraphicCard";
import * as HDDProduct from "./HDD";
import * as Mainboard from "./Mainboard";
import * as PSUProduct from "./PSU";
import * as RAMProduct from "./RAM";
import * as SSDProduct from "./SSD";
import * as CPUBlock from "./CPUBlock";
import * as PumpProduct from "./Pump";
import * as RadiatorProduct from "./Radiator";

export enum Name {
  CPU = "cpu",
  GPU = "gpu",
  GRAPHIC_CARD = "graphic_card",
  MAIN = "mainboard",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
  CPU_BLOCK = "cpu_block",
  PUMP = "pump",
  RADIATOR = "radiator",
}

/**
 * DECLARE THE PRODUCT RELATED MAPPING AND FILTER.
 */
export const Label: { [key in Name]: string } = {
  [Name.CPU]: CPUProduct.Label,
  [Name.GPU]: GPUProduct.Label,
  [Name.GRAPHIC_CARD]: GraphicCard.Label,
  [Name.MAIN]: Mainboard.Label,
  [Name.RAM]: RAMProduct.Label,
  [Name.SSD]: SSDProduct.Label,
  [Name.HDD]: HDDProduct.Label,
  [Name.PSU]: PSUProduct.Label,
  [Name.CASE]: CaseProduct.Label,
  [Name.COOLER]: CoolerProduct.Label,
  [Name.AIO]: AIOProduct.Label,
  [Name.FAN]: FanProduct.Label,
  [Name.CPU_BLOCK]: CPUBlock.Label,
  [Name.PUMP]: PumpProduct.Label,
  [Name.RADIATOR]: RadiatorProduct.Label,
};

export const AttributeLabels: {
  [key in Name]: { [key in string]: string };
} = {
  [Name.CPU]: CPUProduct.AttributeLabels,
  [Name.GPU]: GPUProduct.AttributeLabels,
  [Name.GRAPHIC_CARD]: GraphicCard.AttributeLabels,
  [Name.MAIN]: Mainboard.AttributeLabels,
  [Name.RAM]: RAMProduct.AttributeLabels,
  [Name.SSD]: SSDProduct.AttributeLabels,
  [Name.HDD]: HDDProduct.AttributeLabels,
  [Name.PSU]: PSUProduct.AttributeLabels,
  [Name.CASE]: CaseProduct.AttributeLabels,
  [Name.COOLER]: CoolerProduct.AttributeLabels,
  [Name.AIO]: AIOProduct.AttributeLabels,
  [Name.FAN]: FanProduct.AttributeLabels,
  [Name.CPU_BLOCK]: CPUBlock.AttributeLabels,
  [Name.PUMP]: PumpProduct.AttributeLabels,
  [Name.RADIATOR]: RadiatorProduct.AttributeLabels,
};

export type Attribute = {
  [Name.CPU]: CPUProduct.Attribute;
  [Name.GPU]: GPUProduct.Attribute;
  [Name.GRAPHIC_CARD]: GraphicCard.Attribute;
  [Name.MAIN]: Mainboard.Attribute;
  [Name.RAM]: RAMProduct.Attribute;
  [Name.SSD]: SSDProduct.Attribute;
  [Name.HDD]: HDDProduct.Attribute;
  [Name.PSU]: PSUProduct.Attribute;
  [Name.CASE]: CaseProduct.Attribute;
  [Name.COOLER]: CoolerProduct.Attribute;
  [Name.AIO]: AIOProduct.Attribute;
  [Name.FAN]: FanProduct.Attribute;
  [Name.CPU_BLOCK]: CPUBlock.Attribute;
  [Name.PUMP]: PumpProduct.Attribute;
  [Name.RADIATOR]: RadiatorProduct.Attribute;
};

/**
 * The product summary options of each {@link Name} type.
 * Contains the schema of the summary of each product.
 */
export const Summary: {
  [key in Name]: ZodObject<{ [key in string]: ZodSchema }>;
} = {
  [Name.CPU]: CPUProduct.Summary,
  [Name.GPU]: GPUProduct.Summary,
  [Name.GRAPHIC_CARD]: GraphicCard.Summary,
  [Name.MAIN]: Mainboard.Summary,
  [Name.RAM]: RAMProduct.Summary,
  [Name.SSD]: SSDProduct.Summary,
  [Name.HDD]: HDDProduct.Summary,
  [Name.PSU]: PSUProduct.Summary,
  [Name.CASE]: CaseProduct.Summary,
  [Name.COOLER]: CoolerProduct.Summary,
  [Name.AIO]: AIOProduct.Summary,
  [Name.FAN]: FanProduct.Summary,
  [Name.CPU_BLOCK]: CPUBlock.Summary,
  [Name.PUMP]: PumpProduct.Summary,
  [Name.RADIATOR]: RadiatorProduct.Summary,
};

/**
 * The product filter options of each {@link Name} type.
 * Contains the attributes and the schema to verify the corresponsding value.
 * This is used to declare and verify the attributes of the product.
 * The attributes here can be different from {@link Info} filter options
 * and the mapping between the two should be defined in more specific implementation.
 */
export const FilterOptions: {
  [key in Name]: ZodObject<{ [key in string]: ZodSchema }>;
} = {
  [Name.CPU]: CPUProduct.Filter,
  [Name.GPU]: GPUProduct.Filter,
  [Name.GRAPHIC_CARD]: GraphicCard.Filter,
  [Name.MAIN]: Mainboard.Filter,
  [Name.RAM]: RAMProduct.Filter,
  [Name.SSD]: SSDProduct.Filter,
  [Name.HDD]: HDDProduct.Filter,
  [Name.PSU]: PSUProduct.Filter,
  [Name.CASE]: CaseProduct.Filter,
  [Name.COOLER]: CoolerProduct.Filter,
  [Name.AIO]: AIOProduct.Filter,
  [Name.FAN]: FanProduct.Filter,
  [Name.CPU_BLOCK]: CPUBlock.Filter,
  [Name.PUMP]: PumpProduct.Filter,
  [Name.RADIATOR]: RadiatorProduct.Filter,
};
