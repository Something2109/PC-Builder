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
}
