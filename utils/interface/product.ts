import { ZodObject, ZodSchema } from "zod";
import { Products } from "../Enum";
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
}
