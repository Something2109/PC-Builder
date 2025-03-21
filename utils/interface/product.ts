import { ZodObject, ZodSchema } from "zod";
import { ToSummaryOptions } from "./utils";
import { Infos, Products } from "../Enum";
import AIOProduct from "./product/AIO";
import CaseProduct from "./product/Case";
import CoolerProduct from "./product/Cooler";
import CPUProduct from "./product/CPU";
import FanProduct from "./product/Fan";
import GPUProduct from "./product/GPU";
import GraphicCard from "./product/GraphicCard";
import HDDProduct from "./product/HDD";
import Mainboard from "./product/Mainboard";
import PSUProduct from "./product/PSU";
import RAMProduct from "./product/RAM";
import SSDProduct from "./product/SSD";
import CPUBlock from "./product/CPUBlock";
import PumpProduct from "./product/Pump";
import RadiatorProduct from "./product/Radiator";

/**
 * DECLARE THE PRODUCT RELATED MAPPING AND FILTER.
 */
export namespace Product {
  export const Label: { [key in Products]: string } = {
    [Products.CPU]: CPUProduct.Label,
    [Products.GPU]: GPUProduct.Label,
    [Products.GRAPHIC_CARD]: GraphicCard.Label,
    [Products.MAIN]: Mainboard.Label,
    [Products.RAM]: RAMProduct.Label,
    [Products.SSD]: SSDProduct.Label,
    [Products.HDD]: HDDProduct.Label,
    [Products.PSU]: PSUProduct.Label,
    [Products.CASE]: CaseProduct.Label,
    [Products.COOLER]: CoolerProduct.Label,
    [Products.AIO]: AIOProduct.Label,
    [Products.FAN]: FanProduct.Label,
    [Products.CPU_BLOCK]: CPUBlock.Label,
    [Products.PUMP]: PumpProduct.Label,
    [Products.RADIATOR]: RadiatorProduct.Label,
  };

  export const AttributeLabels: {
    [key in Products]: { [key in string]: string };
  } = {
    [Products.CPU]: CPUProduct.AttributeLabels,
    [Products.GPU]: GPUProduct.AttributeLabels,
    [Products.GRAPHIC_CARD]: GraphicCard.AttributeLabels,
    [Products.MAIN]: Mainboard.AttributeLabels,
    [Products.RAM]: RAMProduct.AttributeLabels,
    [Products.SSD]: SSDProduct.AttributeLabels,
    [Products.HDD]: HDDProduct.AttributeLabels,
    [Products.PSU]: PSUProduct.AttributeLabels,
    [Products.CASE]: CaseProduct.AttributeLabels,
    [Products.COOLER]: CoolerProduct.AttributeLabels,
    [Products.AIO]: AIOProduct.AttributeLabels,
    [Products.FAN]: FanProduct.AttributeLabels,
    [Products.CPU_BLOCK]: CPUBlock.AttributeLabels,
    [Products.PUMP]: PumpProduct.AttributeLabels,
    [Products.RADIATOR]: RadiatorProduct.AttributeLabels,
  };

  /**
   * The mapping from the {@link Products} to the {@link Info} type.
   * Contains all the {@link Info} that a {@link Products} type can have.
   */
  export const Info: { [key in Products]: Infos[] } = {
    [Products.CPU]: CPUProduct.Primary,
    [Products.GPU]: GPUProduct.Primary,
    [Products.GRAPHIC_CARD]: GraphicCard.Primary,
    [Products.MAIN]: Mainboard.Primary,
    [Products.RAM]: RAMProduct.Primary,
    [Products.SSD]: SSDProduct.Primary,
    [Products.HDD]: HDDProduct.Primary,
    [Products.PSU]: PSUProduct.Primary,
    [Products.CASE]: CaseProduct.Primary,
    [Products.COOLER]: CoolerProduct.Primary,
    [Products.AIO]: AIOProduct.Primary,
    [Products.FAN]: FanProduct.Primary,
    [Products.CPU_BLOCK]: CPUBlock.Primary,
    [Products.PUMP]: PumpProduct.Primary,
    [Products.RADIATOR]: RadiatorProduct.Primary,
  };

  /**
   * The product summary options of each {@link Products} type.
   * Contains the schema of the summary of each product.
   */
  export const Summary: {
    [key in Products]: ZodObject<{ [key in string]: ZodSchema }>;
  } = {
    [Products.CPU]: CPUProduct.Summary,
    [Products.GPU]: GPUProduct.Summary,
    [Products.GRAPHIC_CARD]: GraphicCard.Summary,
    [Products.MAIN]: Mainboard.Summary,
    [Products.RAM]: RAMProduct.Summary,
    [Products.SSD]: SSDProduct.Summary,
    [Products.HDD]: HDDProduct.Summary,
    [Products.PSU]: PSUProduct.Summary,
    [Products.CASE]: CaseProduct.Summary,
    [Products.COOLER]: CoolerProduct.Summary,
    [Products.AIO]: AIOProduct.Summary,
    [Products.FAN]: FanProduct.Summary,
    [Products.CPU_BLOCK]: CPUBlock.Summary,
    [Products.PUMP]: PumpProduct.Summary,
    [Products.RADIATOR]: RadiatorProduct.Summary,
  };

  /**
   * The product filter options of each {@link Products} type.
   * Contains the attributes and the schema to verify the corresponsding value.
   * This is used to declare and verify the attributes of the product.
   * The attributes here can be different from {@link Info} filter options
   * and the mapping between the two should be defined in more specific implementation.
   */
  export const FilterOptions: {
    [key in Products]: ZodSchema;
  } = {
    [Products.CPU]: CPUProduct.Filter,
    [Products.GPU]: GPUProduct.Filter,
    [Products.GRAPHIC_CARD]: GraphicCard.Filter,
    [Products.MAIN]: Mainboard.Filter,
    [Products.RAM]: RAMProduct.Filter,
    [Products.SSD]: SSDProduct.Filter,
    [Products.HDD]: HDDProduct.Filter,
    [Products.PSU]: PSUProduct.Filter,
    [Products.CASE]: CaseProduct.Filter,
    [Products.COOLER]: CoolerProduct.Filter,
    [Products.AIO]: AIOProduct.Filter,
    [Products.FAN]: FanProduct.Filter,
    [Products.CPU_BLOCK]: CPUBlock.Filter,
    [Products.PUMP]: PumpProduct.Filter,
    [Products.RADIATOR]: RadiatorProduct.Filter,
  };

  export const AttributeMapping: {
    [key in Products]: Record<string, [Infos, string]>;
  } = {
    [Products.CPU]: CPUProduct.AttributeMapping,
    [Products.GPU]: GPUProduct.AttributeMapping,
    [Products.GRAPHIC_CARD]: GraphicCard.AttributeMapping,
    [Products.MAIN]: Mainboard.AttributeMapping,
    [Products.RAM]: RAMProduct.AttributeMapping,
    [Products.SSD]: SSDProduct.AttributeMapping,
    [Products.HDD]: HDDProduct.AttributeMapping,
    [Products.PSU]: PSUProduct.AttributeMapping,
    [Products.CASE]: CaseProduct.AttributeMapping,
    [Products.COOLER]: CoolerProduct.AttributeMapping,
    [Products.AIO]: AIOProduct.AttributeMapping,
    [Products.FAN]: FanProduct.AttributeMapping,
    [Products.CPU_BLOCK]: CPUBlock.AttributeMapping,
    [Products.PUMP]: PumpProduct.AttributeMapping,
    [Products.RADIATOR]: RadiatorProduct.AttributeMapping,
  };

  export const SummaryAttributeMapping: {
    [key in Products]: { [key in Infos]?: string[] };
  } = {
    [Products.CPU]: ToSummaryOptions(
      CPUProduct.Summary.keyof().options,
      CPUProduct.AttributeMapping
    ),
    [Products.GPU]: ToSummaryOptions(
      GPUProduct.Summary.keyof().options,
      GPUProduct.AttributeMapping
    ),
    [Products.GRAPHIC_CARD]: ToSummaryOptions(
      GraphicCard.Summary.keyof().options,
      GraphicCard.AttributeMapping
    ),
    [Products.MAIN]: ToSummaryOptions(
      Mainboard.Summary.keyof().options,
      Mainboard.AttributeMapping
    ),
    [Products.RAM]: ToSummaryOptions(
      RAMProduct.Summary.keyof().options,
      RAMProduct.AttributeMapping
    ),
    [Products.SSD]: ToSummaryOptions(
      SSDProduct.Summary.keyof().options,
      SSDProduct.AttributeMapping
    ),
    [Products.HDD]: ToSummaryOptions(
      HDDProduct.Summary.keyof().options,
      HDDProduct.AttributeMapping
    ),
    [Products.PSU]: ToSummaryOptions(
      PSUProduct.Summary.keyof().options,
      PSUProduct.AttributeMapping
    ),
    [Products.CASE]: ToSummaryOptions(
      CaseProduct.Summary.keyof().options,
      CaseProduct.AttributeMapping
    ),
    [Products.COOLER]: ToSummaryOptions(
      CoolerProduct.Summary.keyof().options,
      CoolerProduct.AttributeMapping
    ),
    [Products.AIO]: ToSummaryOptions(
      AIOProduct.Summary.keyof().options,
      AIOProduct.AttributeMapping
    ),
    [Products.FAN]: ToSummaryOptions(
      FanProduct.Summary.keyof().options,
      FanProduct.AttributeMapping
    ),
    [Products.CPU_BLOCK]: ToSummaryOptions(
      CPUBlock.Summary.keyof().options,
      CPUBlock.AttributeMapping
    ),
    [Products.PUMP]: ToSummaryOptions(
      PumpProduct.Summary.keyof().options,
      PumpProduct.AttributeMapping
    ),
    [Products.RADIATOR]: ToSummaryOptions(
      RadiatorProduct.Summary.keyof().options,
      RadiatorProduct.AttributeMapping
    ),
  };
}
