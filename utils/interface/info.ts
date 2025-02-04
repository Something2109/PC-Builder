import { Info as InfoEnum } from "../Enum";
import AIO from "./info/AIO";
import Case from "./info/Case";
import Cooler from "./info/Cooler";
import CPU from "./info/CPU";
import Fan from "./info/Fan";
import GPU from "./info/GPU";
import GraphicCard from "./info/GraphicCard";
import HDD from "./info/HDD";
import Mainboard from "./info/Mainboard";
import PSU from "./info/PSU";
import RAM from "./info/RAM";
import SSD from "./info/SSD";
import CPUBlock from "./info/CPUBlock";
import Pump from "./info/Pump";
import Radiator from "./info/Radiator";

/**
 * DECLARE THE {@link InfoEnum} RELATED MAPPING OBJECTS
 * TO BE USED IN MANY DYNAMIC MAPPING OF THE PROJECT
 */
export namespace Info {
  /**
   * The label list of the information.
   * Contains the label corresponding to each {@link InfoEnum} type.
   */
  export const Label: Record<InfoEnum, string> = {
    [InfoEnum.CPU]: "CPU",
    [InfoEnum.GPU]: "GPU",
    [InfoEnum.GRAPHIC_CARD]: "Graphic Card",
    [InfoEnum.MAIN]: "Mainboard",
    [InfoEnum.RAM]: "RAM",
    [InfoEnum.SSD]: "SSD",
    [InfoEnum.HDD]: "HDD",
    [InfoEnum.PSU]: "PSU",
    [InfoEnum.CASE]: "Case",
    [InfoEnum.FAN]: "Fan",
    [InfoEnum.COOLER]: "Cooler",
    [InfoEnum.AIO]: "AIO",
    [InfoEnum.CPU_BLOCK]: "CPU Block",
    [InfoEnum.PUMP]: "Pump",
    [InfoEnum.RADIATOR]: "Radiator",
  };

  /**
   * The attribute label list of the information.
   * Contains the label corresponding to each attribute in each {@link InfoEnum} type.
   */
  export const AttributeLabels: Record<InfoEnum, Record<string, string>> = {
    [InfoEnum.CPU]: CPU.Label,
    [InfoEnum.GPU]: GPU.Label,
    [InfoEnum.GRAPHIC_CARD]: GraphicCard.Label,
    [InfoEnum.MAIN]: Mainboard.Label,
    [InfoEnum.RAM]: RAM.Label,
    [InfoEnum.SSD]: SSD.Label,
    [InfoEnum.HDD]: HDD.Label,
    [InfoEnum.PSU]: PSU.Label,
    [InfoEnum.CASE]: Case.Label,
    [InfoEnum.FAN]: Fan.Label,
    [InfoEnum.COOLER]: Cooler.Label,
    [InfoEnum.AIO]: AIO.Label,
    [InfoEnum.CPU_BLOCK]: CPUBlock.Label,
    [InfoEnum.PUMP]: Pump.Label,
    [InfoEnum.RADIATOR]: Radiator.Label,
  };

  /**
   * The summary attribute list of the information.
   * Contains the attributes that are considered as the notable attributes of each {@link InfoEnum} type.
   */
  export const SummaryAttributes: Record<InfoEnum, string[]> = {
    [InfoEnum.CPU]: CPU.SummaryAttributes,
    [InfoEnum.GPU]: GPU.SummaryAttributes,
    [InfoEnum.GRAPHIC_CARD]: GraphicCard.SummaryAttributes,
    [InfoEnum.MAIN]: Mainboard.SummaryAttributes,
    [InfoEnum.RAM]: RAM.SummaryAttributes,
    [InfoEnum.SSD]: SSD.SummaryAttributes,
    [InfoEnum.HDD]: HDD.SummaryAttributes,
    [InfoEnum.PSU]: PSU.SummaryAttributes,
    [InfoEnum.CASE]: Case.SummaryAttributes,
    [InfoEnum.FAN]: Fan.SummaryAttributes,
    [InfoEnum.COOLER]: Cooler.SummaryAttributes,
    [InfoEnum.AIO]: AIO.SummaryAttributes,
    [InfoEnum.CPU_BLOCK]: CPUBlock.SummaryAttributes,
    [InfoEnum.PUMP]: Pump.SummaryAttributes,
    [InfoEnum.RADIATOR]: Radiator.SummaryAttributes,
  };

  /**
   * The filter attribute list of the information.
   * Contains the attributes that can be used as filter in each {@link InfoEnum} type.
   */
  export const FilterAttributes: Record<InfoEnum, string[]> = {
    [InfoEnum.CPU]: CPU.FilterAttributes,
    [InfoEnum.GPU]: GPU.FilterAttributes,
    [InfoEnum.GRAPHIC_CARD]: GraphicCard.FilterAttributes,
    [InfoEnum.MAIN]: Mainboard.FilterAttributes,
    [InfoEnum.RAM]: RAM.FilterAttributes,
    [InfoEnum.SSD]: SSD.FilterAttributes,
    [InfoEnum.HDD]: HDD.FilterAttributes,
    [InfoEnum.PSU]: PSU.FilterAttributes,
    [InfoEnum.CASE]: Case.FilterAttributes,
    [InfoEnum.FAN]: Fan.FilterAttributes,
    [InfoEnum.COOLER]: Cooler.FilterAttributes,
    [InfoEnum.AIO]: AIO.FilterAttributes,
    [InfoEnum.CPU_BLOCK]: CPUBlock.FilterAttributes,
    [InfoEnum.PUMP]: Pump.FilterAttributes,
    [InfoEnum.RADIATOR]: Radiator.FilterAttributes,
  };
}
