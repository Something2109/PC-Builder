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
import PSU from "./info/PSU";
import RAM from "./info/RAM";
import SSD from "./info/SSD";
import CPUBlock from "./info/CPUBlock";
import Pump from "./info/Pump";
import Radiator from "./info/Radiator";

/**
 * DECLARE THE {@link Infos} RELATED MAPPING OBJECTS
 * TO BE USED IN MANY DYNAMIC MAPPING OF THE PROJECT
 */
export namespace Information {
  /**
   * The label list of the information.
   * Contains the label corresponding to each {@link Infos} type.
   */
  export const Label: Record<Infos, string> = {
    [Infos.CPU]: "CPU",
    [Infos.GPU]: "GPU",
    [Infos.GRAPHIC_CARD]: "Graphic Card",
    [Infos.MAIN]: "Mainboard",
    [Infos.RAM]: "RAM",
    [Infos.SSD]: "SSD",
    [Infos.HDD]: "HDD",
    [Infos.PSU]: "PSU",
    [Infos.CASE]: "Case",
    [Infos.FAN]: "Fan",
    [Infos.COOLER]: "Cooler",
    [Infos.AIO]: "AIO",
    [Infos.CPU_BLOCK]: "CPU Block",
    [Infos.PUMP]: "Pump",
    [Infos.RADIATOR]: "Radiator",
  };

  /**
   * The attribute label list of the information.
   * Contains the label corresponding to each attribute in each {@link Infos} type.
   */
  export const AttributeLabels: Record<Infos, Record<string, string>> = {
    [Infos.CPU]: CPU.Label,
    [Infos.GPU]: GPU.Label,
    [Infos.GRAPHIC_CARD]: GraphicCard.Label,
    [Infos.MAIN]: Mainboard.Label,
    [Infos.RAM]: RAM.Label,
    [Infos.SSD]: SSD.Label,
    [Infos.HDD]: HDD.Label,
    [Infos.PSU]: PSU.Label,
    [Infos.CASE]: Case.Label,
    [Infos.FAN]: Fan.Label,
    [Infos.COOLER]: Cooler.Label,
    [Infos.AIO]: AIO.Label,
    [Infos.CPU_BLOCK]: CPUBlock.Label,
    [Infos.PUMP]: Pump.Label,
    [Infos.RADIATOR]: Radiator.Label,
  };

  /**
   * The summary attribute list of the information.
   * Contains the attributes that are considered as the notable attributes of each {@link Infos} type.
   */
  export const SummaryAttributes: Record<Infos, string[]> = {
    [Infos.CPU]: CPU.SummaryAttributes,
    [Infos.GPU]: GPU.SummaryAttributes,
    [Infos.GRAPHIC_CARD]: GraphicCard.SummaryAttributes,
    [Infos.MAIN]: Mainboard.SummaryAttributes,
    [Infos.RAM]: RAM.SummaryAttributes,
    [Infos.SSD]: SSD.SummaryAttributes,
    [Infos.HDD]: HDD.SummaryAttributes,
    [Infos.PSU]: PSU.SummaryAttributes,
    [Infos.CASE]: Case.SummaryAttributes,
    [Infos.FAN]: Fan.SummaryAttributes,
    [Infos.COOLER]: Cooler.SummaryAttributes,
    [Infos.AIO]: AIO.SummaryAttributes,
    [Infos.CPU_BLOCK]: CPUBlock.SummaryAttributes,
    [Infos.PUMP]: Pump.SummaryAttributes,
    [Infos.RADIATOR]: Radiator.SummaryAttributes,
  };

  /**
   * The filter attribute list of the information.
   * Contains the attributes that can be used as filter in each {@link Infos} type.
   */
  export const FilterAttributes: Record<Infos, string[]> = {
    [Infos.CPU]: CPU.FilterAttributes,
    [Infos.GPU]: GPU.FilterAttributes,
    [Infos.GRAPHIC_CARD]: GraphicCard.FilterAttributes,
    [Infos.MAIN]: Mainboard.FilterAttributes,
    [Infos.RAM]: RAM.FilterAttributes,
    [Infos.SSD]: SSD.FilterAttributes,
    [Infos.HDD]: HDD.FilterAttributes,
    [Infos.PSU]: PSU.FilterAttributes,
    [Infos.CASE]: Case.FilterAttributes,
    [Infos.FAN]: Fan.FilterAttributes,
    [Infos.COOLER]: Cooler.FilterAttributes,
    [Infos.AIO]: AIO.FilterAttributes,
    [Infos.CPU_BLOCK]: CPUBlock.FilterAttributes,
    [Infos.PUMP]: Pump.FilterAttributes,
    [Infos.RADIATOR]: Radiator.FilterAttributes,
  };
}
