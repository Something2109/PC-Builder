import { z } from "zod";

import * as CaseFanSupport from "./CaseFanSupport";
import * as CaseHardDriveSupport from "./CaseHardDriveSupport";
import * as CaseMainboardSupport from "./CaseMainboardSupport";
import * as CasePSUSupport from "./CasePSUSupport";
import * as CaseRadiatorSupport from "./CaseRadiatorSupport";
import * as CaseSpec from "./CaseSpec";
import * as CPUBlockSocketSupport from "./CPUBlockSocketSupport";
import * as CPUBlockSpec from "./CPUBlockSpec";
import * as CPUCoreConfig from "./CPUCoreConfig";
import * as CPUMemory from "./CPUMemory";
import * as CPUPerformance from "./CPUPerformance";
import * as CPUSpec from "./CPUSpec";
import * as FanSpec from "./FanSpec";
import * as GPUFeature from "./GPUFeature";
import * as GPUMemory from "./GPUMemory";
import * as GPUPerformance from "./GPUPerformance";
import * as GPUSpec from "./GPUSpec";
import * as GraphicCardPort from "./GraphicCardPort";
import * as GraphicCardSpec from "./GraphicCardSpec";
import * as HDDSpec from "./HDDSpec";
import * as MainboardFanConnector from "./MainboardFanConnector";
import * as MainboardPCIe from "./MainboardPCIe";
import * as MainboardPowerConnector from "./MainboardPowerConnector";
import * as MainboardSpec from "./MainboardSpec";
import * as MainboardStorageConnector from "./MainboardStorageConnector";
import * as MainboardUSBConnector from "./MainboardUSBConnector";
import * as PartExternalPorts from "./PartExternalPorts";
import * as ProcessorCache from "./ProcessorCache";
import * as PSUConnector from "./PSUConnector";
import * as PSUSpec from "./PSUSpec";
import * as PumpSpec from "./PumpSpec";
import * as RadiatorSpec from "./RadiatorSpec";
import * as RAMSpec from "./RAMSpec";
import * as SSDSpec from "./SSDSpec";
import * as StorageCache from "./StorageCache";
import * as StoragePerformance from "./StoragePerformance";

export enum Name {
  CPU_SPEC = "cpu_spec",
  CPU_CORES = "cpu_core_config",
  CPU_PERF = "cpu_performance",
  CPU_MEMORY = "cpu_memory",
  GPU_SPEC = "gpu_spec",
  GPU_PERF = "gpu_performance",
  GPU_MEMORY = "gpu_memory",
  GPU_FEAT = "gpu_feature",
  PROCESSOR_CACHE = "processor_cache",
  GRAPHIC_CARD_SPEC = "graphic_card_spec",
  GRAPHIC_CARD_PORT = "graphic_card_external_port",
  MAIN_SPEC = "mainboard_spec",
  MAIN_POWER = "mainboard_power",
  MAIN_PCIE = "mainboard_pcie",
  MAIN_STORAGE = "mainboard_storage",
  MAIN_USB = "mainboard_usb",
  MAIN_FAN = "mainboard_fan",
  RAM_SPEC = "ram_spec",
  SSD_SPEC = "ssd_spec",
  HDD_SPEC = "hdd_spec",
  STORAGE_PERF = "storage_performance",
  STORAGE_CACHE = "storage_cache",
  PSU_SPEC = "psu_spec",
  PSU_CONNECTOR = "psu_connector",
  CASE_SPEC = "case_spec",
  CASE_MAIN = "case_mainboard_support",
  CASE_FAN = "case_fan_support",
  CASE_HARD_DRIVE = "case_hard_drive_support",
  CASE_RADIATOR = "case_radiator_support",
  CASE_PSU = "case_psu_support",
  FAN_SPEC = "fan_spec",
  CPU_BLOCK_SPEC = "cpu_block_spec",
  CPU_BLOCK_SOCKET = "cpu_block_socket",
  PUMP_SPEC = "pump_spec",
  RADIATOR_SPEC = "radiator_spec",
  EXTERNAL_PORTS = "external_ports",
}

const Schemas = {
  [Name.CPU_SPEC]: CPUSpec.Schemas,
  [Name.CPU_PERF]: CPUPerformance.Schemas,
  [Name.CPU_CORES]: CPUCoreConfig.Schemas,
  [Name.CPU_MEMORY]: CPUMemory.Schemas,
  [Name.GPU_SPEC]: GPUSpec.Schemas,
  [Name.GPU_PERF]: GPUPerformance.Schemas,
  [Name.GPU_MEMORY]: GPUMemory.Schemas,
  [Name.GPU_FEAT]: GPUFeature.Schemas,
  [Name.PROCESSOR_CACHE]: ProcessorCache.Schemas,
  [Name.GRAPHIC_CARD_SPEC]: GraphicCardSpec.Schemas,
  [Name.GRAPHIC_CARD_PORT]: GraphicCardPort.Schemas,
  [Name.MAIN_SPEC]: MainboardSpec.Schemas,
  [Name.MAIN_POWER]: MainboardPowerConnector.Schemas,
  [Name.MAIN_PCIE]: MainboardPCIe.Schemas,
  [Name.MAIN_STORAGE]: MainboardStorageConnector.Schemas,
  [Name.MAIN_USB]: MainboardUSBConnector.Schemas,
  [Name.MAIN_FAN]: MainboardFanConnector.Schemas,
  [Name.RAM_SPEC]: RAMSpec.Schemas,
  [Name.SSD_SPEC]: SSDSpec.Schemas,
  [Name.HDD_SPEC]: HDDSpec.Schemas,
  [Name.STORAGE_PERF]: StoragePerformance.Schemas,
  [Name.STORAGE_CACHE]: StorageCache.Schemas,
  [Name.PSU_SPEC]: PSUSpec.Schemas,
  [Name.PSU_CONNECTOR]: PSUConnector.Schemas,
  [Name.CASE_SPEC]: CaseSpec.Schemas,
  [Name.CASE_MAIN]: CaseMainboardSupport.Schemas,
  [Name.CASE_FAN]: CaseFanSupport.Schemas,
  [Name.CASE_HARD_DRIVE]: CaseHardDriveSupport.Schemas,
  [Name.CASE_RADIATOR]: CaseRadiatorSupport.Schemas,
  [Name.CASE_PSU]: CasePSUSupport.Schemas,
  [Name.FAN_SPEC]: FanSpec.Schemas,
  [Name.CPU_BLOCK_SPEC]: CPUBlockSpec.Schemas,
  [Name.CPU_BLOCK_SOCKET]: CPUBlockSocketSupport.Schemas,
  [Name.PUMP_SPEC]: PumpSpec.Schemas,
  [Name.RADIATOR_SPEC]: RadiatorSpec.Schemas,
  [Name.EXTERNAL_PORTS]: PartExternalPorts.Schemas,
};

const MultipleValueInfo = [
  Name.CPU_CORES,
  Name.CPU_MEMORY,
  Name.GRAPHIC_CARD_PORT,
  Name.MAIN_POWER,
  Name.MAIN_PCIE,
  Name.MAIN_STORAGE,
  Name.MAIN_USB,
  Name.MAIN_FAN,
  Name.PSU_CONNECTOR,
  Name.CASE_MAIN,
  Name.CASE_FAN,
  Name.CASE_HARD_DRIVE,
  Name.CASE_RADIATOR,
  Name.CASE_PSU,
  Name.CPU_BLOCK_SOCKET,
  Name.EXTERNAL_PORTS,
] as const;

function objectMap<
  Obj extends Record<string, any>,  
  Map extends (arg: [keyof Obj, Obj[keyof Obj]]) => [keyof Obj, unknown]
>(obj: Obj, map: Map) {
  return Object.fromEntries(Object.entries(obj).map(map)) as {
    [key in keyof Obj]: ReturnType<Map>[1];
  };
}

/**
 * DECLARE THE {@link Name} RELATED MAPPING OBJECTS
 * TO BE USED IN MANY DYNAMIC MAPPING OF THE PROJECT
 */
export const Info = z.object(
  objectMap(Schemas, ([key, value]) => [key, value.Info]) as {
    [key in Name]: (typeof Schemas)[key]["Info"];
  }
);

export type Info = z.infer<typeof Info>;

export type MultipleValueInfo = (typeof MultipleValueInfo)[number];

/**
 * The label list of the information.
 * Contains the label corresponding to each {@link Name} type.
 */
export const Label: Record<Name, string> = {
  [Name.CPU_SPEC]: "CPU Specs",
  [Name.CPU_PERF]: "CPU Performance",
  [Name.CPU_CORES]: "CPU Core Spec",
  [Name.CPU_MEMORY]: "Processor Memory",
  [Name.GPU_SPEC]: "GPU Specs",
  [Name.GPU_PERF]: "GPU Performance",
  [Name.GPU_MEMORY]: "Graphic Card Memory",
  [Name.GPU_FEAT]: "GPU Features",
  [Name.PROCESSOR_CACHE]: "Processor Cache",
  [Name.GRAPHIC_CARD_SPEC]: "Graphic Card Specs",
  [Name.GRAPHIC_CARD_PORT]: "Display External Ports",
  [Name.MAIN_SPEC]: "Mainboard Specs",
  [Name.MAIN_POWER]: "Mainboard Power Connectors",
  [Name.MAIN_PCIE]: "Mainboard PCIe",
  [Name.MAIN_STORAGE]: "Mainboard Storage",
  [Name.MAIN_USB]: "Mainboard USB",
  [Name.MAIN_FAN]: "Mainboard Fan Connectors",
  [Name.RAM_SPEC]: "RAM Specs",
  [Name.SSD_SPEC]: "SSD Specs",
  [Name.HDD_SPEC]: "HDD Specs",
  [Name.STORAGE_PERF]: "Storage Performance",
  [Name.STORAGE_CACHE]: "Storage Cache",
  [Name.PSU_SPEC]: "PSU Specs",
  [Name.PSU_CONNECTOR]: "PSU Power Connector",
  [Name.CASE_SPEC]: "Case Specs",
  [Name.CASE_MAIN]: "Case Mainboard Support",
  [Name.CASE_FAN]: "Case Fan Support",
  [Name.CASE_HARD_DRIVE]: "Case Hard Drive Support",
  [Name.CASE_RADIATOR]: "Case Radiator Support",
  [Name.CASE_PSU]: "Case PSU Support",
  [Name.FAN_SPEC]: "Fan Specs",
  [Name.CPU_BLOCK_SPEC]: "CPU Block Specs",
  [Name.CPU_BLOCK_SOCKET]: "CPU Block Socket Support",
  [Name.PUMP_SPEC]: "Pump Specs",
  [Name.RADIATOR_SPEC]: "Radiator Specs",
  [Name.EXTERNAL_PORTS]: "External Ports",
};

/**
 * The model schema of each info type.
 * Contains the type of each attribute of the info from each {@link Name} type.
 */
export type Model = {
  [key in Name]: key extends MultipleValueInfo
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
 * Contains the most detailed information of the info from each {@link Name} type.
 */
export type DTO = {
  [key in Name]: key extends MultipleValueInfo
    ? z.ZodArray<(typeof Schemas)[key]["DTO"]>
    : ReturnType<(typeof Schemas)[key]["DTO"]["nullish"]>;
};

export const DTO = objectMap(Schemas, ([key, value]) =>
  MultipleValueInfo.includes(key as MultipleValueInfo)
    ? [key, z.array(value.DTO)]
    : [key, value.DTO.nullish()]
) as DTO;
