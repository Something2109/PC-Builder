const MainboardFormFactors = [
  "Pico-ITX",
  "Mini-ITX",
  "Mini-ATX",
  "microATX",
  "ATX",
  "EATX",
];

type MainboardFormFactorType = (typeof MainboardFormFactors)[number];

const RAMFormFactors = ["DIMM", "SO-DIMM", "CAMM2"];

type RAMFormFactorType = (typeof RAMFormFactors)[number];

const RAMProtocols = [
  "DDR1",
  "DDR2",
  "DDR3",
  "LPDDR3",
  "DDR4",
  "LPDDR4",
  "DDR5",
];

type RAMProtocolType = (typeof RAMProtocols)[number];

const SSDFormFactors = [
  "2.5",
  "U.2",
  "mSATA",
  "M.2 2230",
  "M.2 2242",
  "M.2 2280",
  "M.2 22110",
];

type SSDFormFactorType = (typeof SSDFormFactors)[number];

const SSDProtocols = ["AHCI", "NVMe"];

type SSDProtocolType = (typeof SSDProtocols)[number];

const SSDInterfaces = ["SATA", "PCIe"];

type SSDInterfaceType = (typeof SSDInterfaces)[number];

const HDDFormFactors = ["2.5", "3.5"];

type HDDFormFactorType = (typeof HDDFormFactors)[number];

const HDDProtocols = ["SATA", "SAS", "PATA"];

type HDDProtocolType = (typeof HDDProtocols)[number];

const PSUFormFactors = [
  "ATX PS/2",
  "ATX PS/3",
  "SFX",
  "SFX-L",
  "TFX",
  "Flex ATX",
];

type PSUFormFactorType = (typeof PSUFormFactors)[number];

const PSUModulars = ["Non-Modular", "Semi-Modular", "Full-Modular"];

type PSUModularType = (typeof PSUModulars)[number];

const PSUEfficiencies = [
  "None",
  "80 Plus",
  "80 PLUS Bronze",
  "80 PLUS Silver",
  "80 PLUS Gold",
  "80 PLUS Platinum",
  "80 PLUS Titanium",
];

type PSUEfficiencyType = (typeof PSUModulars)[number];

const CaseFormFactors = [
  "Mini-Tower",
  "Micro-Tower",
  "Mid-Tower",
  "Full-Tower",
];

type CaseFormFactorType = (typeof CaseFormFactors)[number];

const CaseSide = ["top", "bottom", "front", "rear", "side"];

type CaseSideType = (typeof CaseSide)[number];

const FanFormFactors = ["40", "80", "92", "120", "140", "180", "200"];

type FanFormFactorType = (typeof FanFormFactors)[number];

const FanBearings = ["Fluid dynamic", "Ball", "Sleeve", "Rifle"];

type FanBearingType = (typeof FanBearings)[number];

const CoolerCPUPlates = ["copper", "alluminium"];

type CoolerCPUPlateType = (typeof CoolerCPUPlates)[number];

const AIOFormFactors = ["120", "140", "240", "280", "360", "420"];

type AIOFormFactorType = (typeof AIOFormFactors)[number];

export {
  MainboardFormFactors,
  RAMFormFactors,
  RAMProtocols,
  SSDFormFactors,
  SSDProtocols,
  SSDInterfaces,
  HDDFormFactors,
  HDDProtocols,
  PSUFormFactors,
  PSUModulars,
  PSUEfficiencies,
  CaseFormFactors,
  CaseSide,
  FanFormFactors,
  FanBearings,
  CoolerCPUPlates,
  AIOFormFactors,
};

export type {
  MainboardFormFactorType,
  RAMFormFactorType,
  RAMProtocolType,
  SSDFormFactorType,
  SSDProtocolType,
  SSDInterfaceType,
  HDDFormFactorType,
  HDDProtocolType,
  PSUFormFactorType,
  PSUModularType,
  PSUEfficiencyType,
  CaseFormFactorType,
  CaseSideType,
  FanFormFactorType,
  FanBearingType,
  CoolerCPUPlateType,
  AIOFormFactorType,
};
