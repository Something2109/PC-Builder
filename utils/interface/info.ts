import { z } from "zod";
import { Infos } from "../Enum";
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
import CPUSpec from "./info/CPUSpec";
import FanSpec from "./info/FanSpec";
import GPUFeature from "./info/GPUFeature";
import GPUPerformance from "./info/GPUPerformance";
import GPUSpec from "./info/GPUSpec";
import GraphicCardSpec from "./info/GraphicCardSpec";
import HDDSpec from "./info/HDDSpec";
import MainboardPCIe from "./info/MainboardPCIe";
import MainboardSpec from "./info/MainboardSpec";
import MainboardStorageConnector from "./info/MainboardStorageConnector";
import MainboardUSBConnector from "./info/MainboardUSBConnector";
import ProcessorCache from "./info/ProcessorCache";
import ProcessorMemory from "./info/ProcessorMemorySpec";
import PSUSpec from "./info/PSUSpec";
import PumpSpec from "./info/PumpSpec";
import RadiatorSpec from "./info/RadiatorSpec";
import RAMSpec from "./info/RAMSpec";
import SSDSpec from "./info/SSDSpec";
import StorageCache from "./info/StorageCache";
import StoragePerformance from "./info/StoragePerformance";

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
    [Infos.CPU_SPEC]: "CPU Specs",
    [Infos.CPU_PERF]: "CPU Performance",
    [Infos.CPU_CORES]: "CPU Core Spec",
    [Infos.GPU_SPEC]: "GPU Specs",
    [Infos.GPU_PERF]: "GPU Performance",
    [Infos.GPU_FEAT]: "GPU Features",
    [Infos.PROCESSOR_CACHE]: "Processor Cache",
    [Infos.PROCESSOR_MEMORY]: "Processor Memory",
    [Infos.GRAPHIC_CARD_SPEC]: "Graphic Card Specs",
    [Infos.MAIN_SPEC]: "Mainboard Specs",
    [Infos.MAIN_PCIE]: "Mainboard PCIe",
    [Infos.MAIN_STORAGE]: "Mainboard Storage",
    [Infos.MAIN_USB]: "Mainboard USB",
    [Infos.RAM_SPEC]: "RAM Specs",
    [Infos.SSD_SPEC]: "SSD Specs",
    [Infos.HDD_SPEC]: "HDD Specs",
    [Infos.STORAGE_PERF]: "Storage Performance",
    [Infos.STORAGE_CACHE]: "Storage Cache",
    [Infos.PSU_SPEC]: "PSU Specs",
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
  };

  /**
   * The attribute label list of the information.
   * Contains the label corresponding to each attribute in each {@link Infos} type.
   */
  export const AttributeLabels: Record<Infos, Record<string, string>> = {
    [Infos.CPU_SPEC]: CPUSpec.Label,
    [Infos.CPU_PERF]: CPUPerformance.Label,
    [Infos.CPU_CORES]: CPUCoreConfig.Label,
    [Infos.GPU_SPEC]: GPUSpec.Label,
    [Infos.GPU_PERF]: GPUPerformance.Label,
    [Infos.GPU_FEAT]: GPUFeature.Label,
    [Infos.PROCESSOR_CACHE]: ProcessorCache.Label,
    [Infos.PROCESSOR_MEMORY]: ProcessorMemory.Label,
    [Infos.GRAPHIC_CARD_SPEC]: GraphicCardSpec.Label,
    [Infos.MAIN_SPEC]: MainboardSpec.Label,
    [Infos.MAIN_PCIE]: MainboardPCIe.Label,
    [Infos.MAIN_STORAGE]: MainboardStorageConnector.Label,
    [Infos.MAIN_USB]: MainboardUSBConnector.Label,
    [Infos.RAM_SPEC]: RAMSpec.Label,
    [Infos.SSD_SPEC]: SSDSpec.Label,
    [Infos.HDD_SPEC]: HDDSpec.Label,
    [Infos.STORAGE_PERF]: StoragePerformance.Label,
    [Infos.STORAGE_CACHE]: StorageCache.Label,
    [Infos.PSU_SPEC]: PSUSpec.Label,
    [Infos.CASE_SPEC]: CaseSpec.Label,
    [Infos.CASE_MAIN]: CaseMainboardSupport.Label,
    [Infos.CASE_FAN]: CaseFanSupport.Label,
    [Infos.CASE_HARD_DRIVE]: CaseHardDriveSupport.Label,
    [Infos.CASE_RADIATOR]: CaseRadiatorSupport.Label,
    [Infos.CASE_PSU]: CasePSUSupport.Label,
    [Infos.FAN_SPEC]: FanSpec.Label,
    [Infos.CPU_BLOCK_SPEC]: CPUBlockSpec.Label,
    [Infos.CPU_BLOCK_SOCKET]: CPUBlockSocketSupport.Label,
    [Infos.PUMP_SPEC]: PumpSpec.Label,
    [Infos.RADIATOR_SPEC]: RadiatorSpec.Label,
  };

  /**
   * The detail information of a specific product.
   * Contains the most detailed information of the product from each {@link Infos} type.
   * This is a generic type used in all the {@link Products} type.
   */
  export const Detail = {
    [Infos.CPU_SPEC]: CPUSpec.Schema.partial().nullish(),
    [Infos.CPU_PERF]: CPUPerformance.Schema.partial().nullish(),
    [Infos.CPU_CORES]: CPUCoreConfig.Schema.partial().nullish(),
    [Infos.GPU_SPEC]: GPUSpec.Schema.partial().nullish(),
    [Infos.GPU_PERF]: GPUPerformance.Schema.partial().nullish(),
    [Infos.GPU_FEAT]: GPUFeature.Schema.partial().nullish(),
    [Infos.PROCESSOR_CACHE]: ProcessorCache.Schema.partial().nullish(),
    [Infos.PROCESSOR_MEMORY]: ProcessorMemory.Schema.partial().nullish(),
    [Infos.GRAPHIC_CARD_SPEC]: GraphicCardSpec.Schema.partial().nullish(),
    [Infos.MAIN_SPEC]: MainboardSpec.Schema.partial().nullish(),
    [Infos.MAIN_PCIE]: MainboardPCIe.Schema.nullish(),
    [Infos.MAIN_STORAGE]: MainboardStorageConnector.Schema.nullish(),
    [Infos.MAIN_USB]: MainboardUSBConnector.Schema.nullish(),
    [Infos.RAM_SPEC]: RAMSpec.Schema.partial().nullish(),
    [Infos.SSD_SPEC]: SSDSpec.Schema.partial().nullish(),
    [Infos.HDD_SPEC]: HDDSpec.Schema.partial().nullish(),
    [Infos.STORAGE_PERF]: StoragePerformance.Schema.partial().nullish(),
    [Infos.STORAGE_CACHE]: StorageCache.Schema.partial().nullish(),
    [Infos.PSU_SPEC]: PSUSpec.Schema.partial().nullish(),
    [Infos.CASE_SPEC]: CaseSpec.Schema.partial().nullish(),
    [Infos.CASE_MAIN]: CaseMainboardSupport.Schema.partial().nullish(),
    [Infos.CASE_FAN]: CaseFanSupport.Schema.nullish(),
    [Infos.CASE_HARD_DRIVE]: CaseHardDriveSupport.Schema.nullish(),
    [Infos.CASE_RADIATOR]: CaseRadiatorSupport.Schema.nullish(),
    [Infos.CASE_PSU]: CasePSUSupport.Schema.partial().nullish(),
    [Infos.FAN_SPEC]: FanSpec.Schema.partial().nullish(),
    [Infos.CPU_BLOCK_SPEC]: CPUBlockSpec.Schema.partial().nullish(),
    [Infos.CPU_BLOCK_SOCKET]: CPUBlockSocketSupport.Schema.partial().nullish(),
    [Infos.PUMP_SPEC]: PumpSpec.Schema.partial().nullish(),
    [Infos.RADIATOR_SPEC]: RadiatorSpec.Schema.partial().nullish(),
  };
}
