import { z } from "zod";

const MainboardFormFactors = z.enum([
  "Pico-ITX",
  "Mini-ITX",
  "Mini-ATX",
  "microATX",
  "ATX",
  "EATX",
]);

type MainboardFormFactorType = z.infer<typeof MainboardFormFactors>;

const RAMFormFactors = z.enum(["DIMM", "SO-DIMM", "CAMM2"]);

type RAMFormFactorType = z.infer<typeof RAMFormFactors>;

const RAMProtocols = z.enum([
  "DDR1",
  "DDR2",
  "DDR3",
  "LPDDR3",
  "DDR4",
  "LPDDR4",
  "DDR5",
]);

type RAMProtocolType = z.infer<typeof RAMProtocols>;

const SSDMemoryCells = z.enum(["SLC", "MLC", "TLC", "QLC", "3D"]);

type SSDMemoryCellType = z.infer<typeof SSDMemoryCells>;

const SSDFormFactors = z.enum([
  "2.5",
  "U.2",
  "mSATA",
  "M.2 2230",
  "M.2 2242",
  "M.2 2280",
  "M.2 22110",
]);

type SSDFormFactorType = z.infer<typeof SSDFormFactors>;

const SSDInterfaces = z.enum(["SATA", "U.2", "mSATA", "M.2 PCIe"]);

type SSDInterfaceType = z.infer<typeof SSDInterfaces>;

const HDDFormFactors = z.enum(["2.5", "3.5"]);

type HDDFormFactorType = z.infer<typeof HDDFormFactors>;

const HDDInterfaces = z.enum(["SATA", "SAS", "PATA"]);

type HDDInterfaceType = z.infer<typeof HDDInterfaces>;

const PSUFormFactors = z.enum([
  "ATX PS/2",
  "ATX PS/3",
  "SFX",
  "SFX-L",
  "TFX",
  "Flex ATX",
]);

type PSUFormFactorType = z.infer<typeof PSUFormFactors>;

const PSUModulars = z.enum(["Non-Modular", "Semi-Modular", "Full-Modular"]);

type PSUModularType = z.infer<typeof PSUModulars>;

const PSUEfficiencies = z.enum([
  "None",
  "80 Plus",
  "80 PLUS Bronze",
  "80 PLUS Silver",
  "80 PLUS Gold",
  "80 PLUS Platinum",
  "80 PLUS Titanium",
]);

type PSUEfficiencyType = z.infer<typeof PSUEfficiencies>;

const CaseFormFactors = z.enum([
  "Mini-Tower",
  "Micro-Tower",
  "Mid-Tower",
  "Full-Tower",
]);

type CaseFormFactorType = z.infer<typeof CaseFormFactors>;

const CaseSide = z.enum(["top", "bottom", "front", "rear", "side"]);

type CaseSideType = z.infer<typeof CaseSide>;

const FanFormFactors = z.enum(["40", "80", "92", "120", "140", "180", "200"]);

type FanFormFactorType = z.infer<typeof FanFormFactors>;

const FanBearings = z.enum(["Fluid dynamic", "Ball", "Sleeve", "Rifle"]);

type FanBearingType = z.infer<typeof FanBearings>;

const CoolerCPUPlates = z.enum(["copper", "alluminium"]);

type CoolerCPUPlateType = z.infer<typeof CoolerCPUPlates>;

const AIOFormFactors = z.enum(["120", "140", "240", "280", "360", "420"]);

type AIOFormFactorType = z.infer<typeof AIOFormFactors>;

type FilterOptionsType<Info extends {}, Attributes extends keyof Info> = {
  [key in Attributes]?: Required<Info>[key][];
};

const NumberFilterOptions = z.array(z.number());

const FilterOptions = <T extends z.ZodTypeAny>(zodType: T) => z.array(zodType);

export {
  MainboardFormFactors,
  RAMFormFactors,
  RAMProtocols,
  SSDMemoryCells,
  SSDFormFactors,
  SSDInterfaces,
  HDDFormFactors,
  HDDInterfaces,
  PSUFormFactors,
  PSUModulars,
  PSUEfficiencies,
  CaseFormFactors,
  CaseSide,
  FanFormFactors,
  FanBearings,
  CoolerCPUPlates,
  AIOFormFactors,
  NumberFilterOptions,
  FilterOptions,
};

export type {
  MainboardFormFactorType,
  RAMFormFactorType,
  RAMProtocolType,
  SSDMemoryCellType,
  SSDFormFactorType,
  SSDInterfaceType,
  HDDFormFactorType,
  HDDInterfaceType,
  PSUFormFactorType,
  PSUModularType,
  PSUEfficiencyType,
  CaseFormFactorType,
  CaseSideType,
  FanFormFactorType,
  FanBearingType,
  CoolerCPUPlateType,
  AIOFormFactorType,
  FilterOptionsType,
};
