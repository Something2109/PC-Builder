import { ZodSchema } from "zod";
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

  export const FilterMapping: {
    [key in Products]: Record<string, [Infos, string]>;
  } = {
    [Products.CPU]: CPUProduct.FilterMapping,
    [Products.GPU]: GPUProduct.FilterMapping,
    [Products.GRAPHIC_CARD]: GraphicCard.FilterMapping,
    [Products.MAIN]: Mainboard.FilterMapping,
    [Products.RAM]: RAMProduct.FilterMapping,
    [Products.SSD]: SSDProduct.FilterMapping,
    [Products.HDD]: HDDProduct.FilterMapping,
    [Products.PSU]: PSUProduct.FilterMapping,
    [Products.CASE]: CaseProduct.FilterMapping,
    [Products.COOLER]: CoolerProduct.FilterMapping,
    [Products.AIO]: AIOProduct.FilterMapping,
    [Products.FAN]: FanProduct.FilterMapping,
    [Products.CPU_BLOCK]: CPUBlock.FilterMapping,
    [Products.PUMP]: PumpProduct.FilterMapping,
    [Products.RADIATOR]: RadiatorProduct.FilterMapping,
  };
}
