import { InfoParsing } from "./utils";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
import CPUCoreConfig from "@/utils/interface/part/info/CPUCoreConfig";
import GPUSpec from "@/utils/interface/part/info/GPUSpec";
import GPUPerformance from "@/utils/interface/part/info/GPUPerformance";
import GPUFeature from "@/utils/interface/part/info/GPUFeature";
import ProcessorCache from "@/utils/interface/part/info/ProcessorCache";
import GraphicCardSpec from "@/utils/interface/part/info/GraphicCardSpec";
import GraphicCardPort from "@/utils/interface/part/info/GraphicCardPort";
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";
import MainboardPowerConnector from "@/utils/interface/part/info/MainboardPowerConnector";
import MainboardPCIe from "@/utils/interface/part/info/MainboardPCIe";
import MainboardStorageConnector from "@/utils/interface/part/info/MainboardStorageConnector";
import MainboardUSBConnector from "@/utils/interface/part/info/MainboardUSBConnector";
import MainboardFanConnector from "@/utils/interface/part/info/MainboardFanConnector";
import RAMSpec from "@/utils/interface/part/info/RAMSpec";
import SSDSpec from "@/utils/interface/part/info/SSDSpec";
import HDDSpec from "@/utils/interface/part/info/HDDSpec";
import StoragePerformance from "@/utils/interface/part/info/StoragePerformance";
import StorageCache from "@/utils/interface/part/info/StorageCache";
import PSUSpec from "@/utils/interface/part/info/PSUSpec";
import PSUConnector from "@/utils/interface/part/info/PSUConnector";
import CaseSpec from "@/utils/interface/part/info/CaseSpec";
import CaseFanSupport from "@/utils/interface/part/info/CaseFanSupport";
import CaseRadiatorSupport from "@/utils/interface/part/info/CaseRadiatorSupport";
import CaseHardDriveSupport from "@/utils/interface/part/info/CaseHardDriveSupport";
import CaseMainboardSupport from "@/utils/interface/part/info/CaseMainboardSupport";
import CasePSUSupport from "@/utils/interface/part/info/CasePSUSupport";
import FanSpec from "@/utils/interface/part/info/FanSpec";
import CPUBlockSpec from "@/utils/interface/part/info/CPUBlockSpec";
import PumpSpec from "@/utils/interface/part/info/PumpSpec";
import RadiatorSpec from "@/utils/interface/part/info/RadiatorSpec";
import CPUBlockSocket from "@/utils/interface/part/info/CPUBlockSocketSupport";
import PartExternalPort from "@/utils/interface/part/info/PartExternalPorts";
import {
  Case,
  ExternalPorts,
  FormFactor,
  InternalConnectors,
  Material,
  Primitive,
} from "@/utils/interface/utils";
import {
  FrequencyUnits,
  MemoryUnits,
  MemorySpeedUnit,
  UnitInterface,
  LengthUnits,
  TransferSpeedUnit,
} from "@/utils/extract/Units";
import { ZodEnum } from "zod";
import CPUMemory from "@/utils/interface/part/info/CPUMemory";
import { parse } from "dotenv";
import GPUMemory from "@/utils/interface/part/info/GPUMemory";

const unimplemented = () => {
  throw new Error("Function not implemented.");
};

const parseString = (val: unknown) =>
  typeof val === "string" ? val.trim() : null;

const parseNumber = (val: unknown) => {
  if (typeof val === "string") val = val.match(/\d+\.?\d*/g)?.[0];

  const { data, success } = Primitive.Number.safeParse(val);
  if (!success) return null;
  return data;
};

function parseUnit<T extends string>(Unit: UnitInterface<T>, defaultUnit: T) {
  return (val: unknown) => {
    if (typeof val !== "string") return null;
    const parsed = Unit.parse(val);
    if (!parsed || parsed[0] === null) return null;
    return Unit.exchange(parsed[0], parsed[1], defaultUnit);
  };
}

function parseZodEnum<T extends [string, ...string[]]>(schema: ZodEnum<T>) {
  const regexp = new RegExp(`${schema.options.join("|")}`, "g");

  return (val: unknown) => {
    const valStr = parseString(val);
    if (!valStr) return null;

    const ramVal = valStr.match(regexp);
    if (!ramVal || ramVal.length === 0) return null;

    return ramVal.join(", ") as T[number];
  };
}

export const CPUSpecParsers: InfoParsing<CPUSpec.Info> = {
  family: parseString,
  socket: parseString,
  total_cores: parseNumber,
  total_threads: parseNumber,
  lithography: parseString,
};

export const CPUPerformanceParsers: InfoParsing<CPUPerformance.Info> = {
  base_frequency: parseUnit(FrequencyUnits, "GHz"),
  turbo_frequency: parseUnit(FrequencyUnits, "GHz"),
  tdp: parseNumber,
};

export const CPUCoreConfigParsers: InfoParsing<CPUCoreConfig.Info> = {
  name: parseString,
  count: parseNumber,
  base_frequency: parseUnit(FrequencyUnits, "GHz"),
  turbo_frequency: parseUnit(FrequencyUnits, "GHz"),
};

export const ProcessorCacheParsers: InfoParsing<ProcessorCache.Info> = {
  L1_cache: parseUnit(MemoryUnits, "MB"),
  L2_cache: parseUnit(MemoryUnits, "MB"),
  L3_cache: parseUnit(MemoryUnits, "MB"),
};

export const CPUMemoryParsers: InfoParsing<CPUMemory.Info> = {
  type: parseZodEnum(InternalConnectors.RAM),
  speed: parseUnit(TransferSpeedUnit, "MT/s"),
  capacity: parseUnit(MemoryUnits, "GB"),
  channel_count: parseNumber,
  bandwidth: parseUnit(MemorySpeedUnit, "GB/s"),
};

export const GPUSpecParsers: InfoParsing<GPUSpec.Info> = {
  family: parseString,
  core_count: parseNumber,
  rops: parseNumber,
  tmus: parseNumber,
  execution_unit: parseNumber,
  ray_tracing: parseNumber,
  tensor: parseNumber,
};

export const GPUPerformanceParsers: InfoParsing<GPUPerformance.Info> = {
  base_frequency: parseUnit(FrequencyUnits, "MHz"),
  boost_frequency: parseUnit(FrequencyUnits, "MHz"),
  tdp: parseNumber,
};

export const GPUMemoryParsers: InfoParsing<GPUMemory.Info> = {
  type: parseZodEnum(InternalConnectors.SGRAM),
  speed: parseUnit(FrequencyUnits, "MHz"),
  capacity: parseUnit(MemoryUnits, "GB"),
  bandwidth: parseUnit(MemorySpeedUnit, "GB/s"),
  bus_width: parseNumber,
};

export const GPUFeatureParsers: InfoParsing<GPUFeature.Info> = {
  DirectX: parseString,
  OpenGL: parseString,
  OpenCL: parseString,
  Vulkan: parseString,
  CUDA: parseString,
};

export const GraphicCardSpecParsers: InfoParsing<GraphicCardSpec.Info> = {
  width: unimplemented,
  height: unimplemented,
  length: unimplemented,
  pcie: parseNumber,
  minimum_psu: parseNumber,
  power_connector: parseZodEnum(InternalConnectors.Power.GraphicCard),
  power_connector_count: parseNumber,
};

export const GraphicCardPortParsers: InfoParsing<GraphicCardPort.Info> = {
  type: unimplemented,
  name: unimplemented,
  count: parseNumber,
};

export const MainboardSpecParsers: InfoParsing<MainboardSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.Mainboard),
  socket: parseString,
  chipset: parseString,
  ram_form_factor: parseZodEnum(FormFactor.RAM),
  ram_interface: parseZodEnum(InternalConnectors.RAM),
  ram_slot: parseNumber,
  miscelanous_connectors: unimplemented,
};

export const MainboardPowerConnectorParsers: InfoParsing<MainboardPowerConnector.Info> =
  {
    type: parseZodEnum(InternalConnectors.Power.Mainboard),
    count: parseNumber,
  };

export const MainboardPCIeParsers: InfoParsing<MainboardPCIe.Info> = {
  width: parseZodEnum(InternalConnectors.PCIe.Width),
  controller: parseZodEnum(InternalConnectors.PCIe.Controller),
  version: parseNumber,
  count: parseNumber,
};

export const MainboardStorageConnectorParsers: InfoParsing<MainboardStorageConnector.Info> =
  {
    form_factor: unimplemented,
    count: parseNumber,
  };

export const MainboardUSBConnectorParsers: InfoParsing<MainboardUSBConnector.Info> =
  {
    generation: parseZodEnum(ExternalPorts.Peripheral.USB.Generation),
    connector: parseZodEnum(ExternalPorts.Peripheral.USB.Connector),
    count: parseNumber,
  };

export const MainboardFanConnectorParsers: InfoParsing<MainboardFanConnector.Info> =
  {
    type: parseZodEnum(InternalConnectors.Fan.Type),
    connector: parseZodEnum(InternalConnectors.Fan.Connector),
    count: parseNumber,
  };

export const RAMSpecParsers: InfoParsing<RAMSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.RAM),
  interface: parseZodEnum(InternalConnectors.RAM),
  speed: parseNumber,
  capacity: parseUnit(MemoryUnits, "GB"),
  voltage: parseNumber,
  latency: unimplemented,
  kit: parseNumber,
};

export const SSDSpecParsers: InfoParsing<SSDSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.SSD),
  interface: parseZodEnum(InternalConnectors.Storage.SSD),
  capacity: parseUnit(MemoryUnits, "GB"),
  memory_type: parseZodEnum(SSDSpec.MemoryCell),
  tbw: parseNumber,
};

export const HDDSpecParsers: InfoParsing<HDDSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.HDD),
  interface: parseZodEnum(InternalConnectors.Storage.HDD),
  capacity: parseUnit(MemoryUnits, "GB"),
  rotational_speed: parseNumber,
};

export const StoragePerformanceParsers: InfoParsing<StoragePerformance.Info> = {
  read_speed: parseUnit(MemorySpeedUnit, "MB/s"),
  write_speed: parseUnit(MemorySpeedUnit, "MB/s"),
};

export const StorageCacheParsers: InfoParsing<StorageCache.Info> = {
  type: parseZodEnum(InternalConnectors.RAM),
  capacity: parseUnit(MemoryUnits, "MB"),
};

export const PSUSpecParsers: InfoParsing<PSUSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.PSU),
  wattage: parseNumber,
  efficiency: parseZodEnum(PSUSpec.Efficiency),
  width: unimplemented,
  length: unimplemented,
  height: unimplemented,
  modular: parseZodEnum(PSUSpec.Modular),
};

export const PSUConnectorParsers: InfoParsing<PSUConnector.Info> = {
  type: unimplemented,
  count: parseNumber,
};

export const CaseSpecParsers: InfoParsing<CaseSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.Case),
  width: unimplemented,
  length: unimplemented,
  height: unimplemented,
  expansion_slot: parseNumber,
  max_cooler_height: parseUnit(LengthUnits, "mm"),
  max_psu_length: parseUnit(LengthUnits, "mm"),
};

export const CaseFanSupportParsers: InfoParsing<CaseFanSupport.Info> = {
  case_side: parseZodEnum(Case.Side),
  form_factor: parseZodEnum(FormFactor.Fan),
  count: parseNumber,
};

export const CaseRadiatorSupportParsers: InfoParsing<CaseRadiatorSupport.Info> =
  {
    case_side: parseZodEnum(Case.Side),
    form_factor: parseZodEnum(FormFactor.Radiator),
  };

export const CaseHardDriveSupportParsers: InfoParsing<CaseHardDriveSupport.Info> =
  {
    place: parseZodEnum(Case.HardDrivePlace),
    form_factor: parseZodEnum(Case.HardDriveFormFactor),
    count: parseNumber,
  };

export const CaseMainboardSupportParsers: InfoParsing<CaseMainboardSupport.Info> =
  {
    form_factor: parseZodEnum(FormFactor.Mainboard),
  };

export const CasePSUSupportParsers: InfoParsing<CasePSUSupport.Info> = {
  psu_support: parseZodEnum(FormFactor.PSU),
};

export const FanSpecParsers: InfoParsing<FanSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.Fan),
  width: unimplemented,
  length: unimplemented,
  height: unimplemented,
  count: parseNumber,
  voltage: parseNumber,
  speed: parseNumber,
  airflow: parseNumber,
  noise: parseNumber,
  static_pressure: parseNumber,
  bearing: parseZodEnum(FanSpec.Bearing),
  connector: parseZodEnum(InternalConnectors.Fan.Connector),
  rgb: parseZodEnum(InternalConnectors.RGB),
};

export const CPUBlockSpecParsers: InfoParsing<CPUBlockSpec.Info> = {
  rgb: parseZodEnum(InternalConnectors.RGB),
  plate: parseZodEnum(Material.Metal),
};

export const PumpSpecParsers: InfoParsing<PumpSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.Pump),
  width: unimplemented,
  length: unimplemented,
  height: unimplemented,
  voltage: parseNumber,
  rgb: parseZodEnum(InternalConnectors.RGB),
  wattage: parseNumber,
  head_pressure: parseNumber,
  flow_rate: parseNumber,
  power_connector: parseZodEnum(InternalConnectors.Power.Miscellanous),
  control_connector: parseZodEnum(InternalConnectors.Fan.Connector),
};

export const RadiatorSpecParsers: InfoParsing<RadiatorSpec.Info> = {
  form_factor: parseZodEnum(FormFactor.Radiator),
  width: unimplemented,
  length: unimplemented,
  height: unimplemented,
  fpi: parseNumber,
  material: parseZodEnum(Material.Metal),
};

export const CPUBlockSocketParsers: InfoParsing<CPUBlockSocket.Info> = {
  socket: parseString,
};

export const PartExternalPortsParsers: InfoParsing<PartExternalPort.Info> = {
  type: parseZodEnum(ExternalPorts.Type),
  name: unimplemented,
  count: parseNumber,
};
