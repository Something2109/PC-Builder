import { z } from "zod";
import { Infos } from "../../Enum";
import CaseFanSupport from "./info/CaseFanSupport";
import CaseHardDriveSupport from "./info/CaseHardDriveSupport";
import CaseMainboardSupport from "./info/CaseMainboardSupport";
import CasePSUSupport from "./info/CasePSUSupport";
import CaseRadiatorSupport from "./info/CaseRadiatorSupport";
import CaseSpec from "./info/CaseSpec";
import CPUBlockSocketSupport from "./info/CPUBlockSocketSupport";
import CPUBlockSpec from "./info/CPUBlockSpec";
import CPUCoreConfig from "./info/CPUCoreConfig";
import CPUPerformance from "./info/CPUPerformance";
import CPUMemory from "./info/CPUMemory";
import CPUSpec from "./info/CPUSpec";
import FanSpec from "./info/FanSpec";
import GPUFeature from "./info/GPUFeature";
import GPUMemory from "./info/GPUMemory";
import GPUPerformance from "./info/GPUPerformance";
import GPUSpec from "./info/GPUSpec";
import GraphicCardSpec from "./info/GraphicCardSpec";
import GraphicCardPort from "./info/GraphicCardPort";
import HDDSpec from "./info/HDDSpec";
import MainboardSpec from "./info/MainboardSpec";
import MainboardPowerConnector from "./info/MainboardPowerConnector";
import MainboardPCIe from "./info/MainboardPCIe";
import MainboardStorageConnector from "./info/MainboardStorageConnector";
import MainboardUSBConnector from "./info/MainboardUSBConnector";
import ProcessorCache from "./info/ProcessorCache";
import PSUSpec from "./info/PSUSpec";
import PSUConnector from "./info/PSUConnector";
import PumpSpec from "./info/PumpSpec";
import RadiatorSpec from "./info/RadiatorSpec";
import RAMSpec from "./info/RAMSpec";
import SSDSpec from "./info/SSDSpec";
import StorageCache from "./info/StorageCache";
import StoragePerformance from "./info/StoragePerformance";
import PartExternalPorts from "./info/PartExternalPorts";
import MainboardFanConnector from "./info/MainboardFanConnector";

const Schemas = {
  [Infos.CPU_SPEC]: CPUSpec.Schemas,
  [Infos.CPU_PERF]: CPUPerformance.Schemas,
  [Infos.CPU_CORES]: CPUCoreConfig.Schemas,
  [Infos.CPU_MEMORY]: CPUMemory.Schemas,
  [Infos.GPU_SPEC]: GPUSpec.Schemas,
  [Infos.GPU_PERF]: GPUPerformance.Schemas,
  [Infos.GPU_MEMORY]: GPUMemory.Schemas,
  [Infos.GPU_FEAT]: GPUFeature.Schemas,
  [Infos.PROCESSOR_CACHE]: ProcessorCache.Schemas,
  [Infos.GRAPHIC_CARD_SPEC]: GraphicCardSpec.Schemas,
  [Infos.GRAPHIC_CARD_PORT]: GraphicCardPort.Schemas,
  [Infos.MAIN_SPEC]: MainboardSpec.Schemas,
  [Infos.MAIN_POWER]: MainboardPowerConnector.Schemas,
  [Infos.MAIN_PCIE]: MainboardPCIe.Schemas,
  [Infos.MAIN_STORAGE]: MainboardStorageConnector.Schemas,
  [Infos.MAIN_USB]: MainboardUSBConnector.Schemas,
  [Infos.MAIN_FAN]: MainboardFanConnector.Schemas,
  [Infos.RAM_SPEC]: RAMSpec.Schemas,
  [Infos.SSD_SPEC]: SSDSpec.Schemas,
  [Infos.HDD_SPEC]: HDDSpec.Schemas,
  [Infos.STORAGE_PERF]: StoragePerformance.Schemas,
  [Infos.STORAGE_CACHE]: StorageCache.Schemas,
  [Infos.PSU_SPEC]: PSUSpec.Schemas,
  [Infos.PSU_CONNECTOR]: PSUConnector.Schemas,
  [Infos.CASE_SPEC]: CaseSpec.Schemas,
  [Infos.CASE_MAIN]: CaseMainboardSupport.Schemas,
  [Infos.CASE_FAN]: CaseFanSupport.Schemas,
  [Infos.CASE_HARD_DRIVE]: CaseHardDriveSupport.Schemas,
  [Infos.CASE_RADIATOR]: CaseRadiatorSupport.Schemas,
  [Infos.CASE_PSU]: CasePSUSupport.Schemas,
  [Infos.FAN_SPEC]: FanSpec.Schemas,
  [Infos.CPU_BLOCK_SPEC]: CPUBlockSpec.Schemas,
  [Infos.CPU_BLOCK_SOCKET]: CPUBlockSocketSupport.Schemas,
  [Infos.PUMP_SPEC]: PumpSpec.Schemas,
  [Infos.RADIATOR_SPEC]: RadiatorSpec.Schemas,
  [Infos.EXTERNAL_PORTS]: PartExternalPorts.Schemas,
};

const MultipleValueInfo = [
  Infos.CPU_CORES,
  Infos.CPU_MEMORY,
  Infos.GRAPHIC_CARD_PORT,
  Infos.MAIN_POWER,
  Infos.MAIN_PCIE,
  Infos.MAIN_STORAGE,
  Infos.MAIN_USB,
  Infos.MAIN_FAN,
  Infos.PSU_CONNECTOR,
  Infos.CASE_MAIN,
  Infos.CASE_FAN,
  Infos.CASE_HARD_DRIVE,
  Infos.CASE_RADIATOR,
  Infos.CASE_PSU,
  Infos.CPU_BLOCK_SOCKET,
  Infos.EXTERNAL_PORTS,
] as const;

function objectMap<
  Obj extends Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  Map extends (arg: [keyof Obj, Obj[keyof Obj]]) => [keyof Obj, unknown]
>(obj: Obj, map: Map) {
  return Object.fromEntries(Object.entries(obj).map(map)) as {
    [key in keyof Obj]: ReturnType<Map>[1];
  };
}

/**
 * DECLARE THE {@link Infos} RELATED MAPPING OBJECTS
 * TO BE USED IN MANY DYNAMIC MAPPING OF THE PROJECT
 */
export namespace Information {
  export const Info = z.object(
    objectMap(Schemas, ([key, value]) => [key, value.Info]) as {
      [key in Infos]: (typeof Schemas)[key]["Info"];
    }
  );

  export type Info = z.infer<typeof Info>;

  export type MultipleValueInfo = (typeof MultipleValueInfo)[number];

  /**
   * The label list of the information.
   * Contains the label corresponding to each {@link Infos} type.
   */
  export const Label: Record<Infos, string> = {
    [Infos.CPU_SPEC]: "CPU Specs",
    [Infos.CPU_PERF]: "CPU Performance",
    [Infos.CPU_CORES]: "CPU Core Spec",
    [Infos.CPU_MEMORY]: "Processor Memory",
    [Infos.GPU_SPEC]: "GPU Specs",
    [Infos.GPU_PERF]: "GPU Performance",
    [Infos.GPU_MEMORY]: "Graphic Card Memory",
    [Infos.GPU_FEAT]: "GPU Features",
    [Infos.PROCESSOR_CACHE]: "Processor Cache",
    [Infos.GRAPHIC_CARD_SPEC]: "Graphic Card Specs",
    [Infos.GRAPHIC_CARD_PORT]: "Display External Ports",
    [Infos.MAIN_SPEC]: "Mainboard Specs",
    [Infos.MAIN_POWER]: "Mainboard Power Connectors",
    [Infos.MAIN_PCIE]: "Mainboard PCIe",
    [Infos.MAIN_STORAGE]: "Mainboard Storage",
    [Infos.MAIN_USB]: "Mainboard USB",
    [Infos.MAIN_FAN]: "Mainboard Fan Connectors",
    [Infos.RAM_SPEC]: "RAM Specs",
    [Infos.SSD_SPEC]: "SSD Specs",
    [Infos.HDD_SPEC]: "HDD Specs",
    [Infos.STORAGE_PERF]: "Storage Performance",
    [Infos.STORAGE_CACHE]: "Storage Cache",
    [Infos.PSU_SPEC]: "PSU Specs",
    [Infos.PSU_CONNECTOR]: "PSU Power Connector",
    [Infos.CASE_SPEC]: "Case Specs",
    [Infos.CASE_MAIN]: "Case Mainboard Support",
    [Infos.CASE_FAN]: "Case Fan Support",
    [Infos.CASE_HARD_DRIVE]: "Case Hard Drive Support",
    [Infos.CASE_RADIATOR]: "Case Radiator Support",
    [Infos.CASE_PSU]: "Case PSU Support",
    [Infos.FAN_SPEC]: "Fan Specs",
    [Infos.CPU_BLOCK_SPEC]: "CPU Block Specs",
    [Infos.CPU_BLOCK_SOCKET]: "CPU Block Socket Support",
    [Infos.PUMP_SPEC]: "Pump Specs",
    [Infos.RADIATOR_SPEC]: "Radiator Specs",
    [Infos.EXTERNAL_PORTS]: "External Ports",
  };

  /**
   * The model schema of each info type.
   * Contains the type of each attribute of the info from each {@link Infos} type.
   */
  export type Model = {
    [key in Infos]: key extends MultipleValueInfo
      ? z.ZodArray<(typeof Schemas)[key]["Model"]>
      : ReturnType<(typeof Schemas)[key]["Model"]["nullable"]>;
  };

  export const Model = objectMap(Schemas, ([key, value]) =>
    MultipleValueInfo.includes(key as MultipleValueInfo)
      ? [key, z.array(value.Model)]
      : [key, value.Model.nullable()]
  ) as Model;

  /**
   * The DTO schema of each info type.
   * Contains the most detailed information of the info from each {@link Infos} type.
   */
  export type DTO = {
    [key in Infos]: key extends MultipleValueInfo
      ? z.ZodArray<(typeof Schemas)[key]["DTO"]>
      : ReturnType<(typeof Schemas)[key]["DTO"]["nullish"]>;
  };

  export const DTO = objectMap(Schemas, ([key, value]) =>
    MultipleValueInfo.includes(key as MultipleValueInfo)
      ? [key, z.array(value.DTO)]
      : [key, value.DTO.nullish()]
  ) as DTO;
}
