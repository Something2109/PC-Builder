enum Products {
  CPU = "cpu",
  GPU = "gpu",
  GRAPHIC_CARD = "graphic_card",
  MAIN = "mainboard",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
}

interface BaseInformation {
  id: string;
  name: string;
  brand: string;
}

interface BaseProcessor extends BaseInformation {
  cores: Core[];
  memory: MemorySpecification;

  base_power: number;
  max_temp: number;
}

interface Core {
  type: string;
  threads: number;
  count: number;

  base_frequency: number;
  turbo_frequency: number;
}

interface MemorySpecification {
  type: string;
  frequency: number;
  capacity: number;
  bandwidth: number;
}

interface CPU extends BaseProcessor {
  cores: Core[];

  L1_cache: number;
  L2_cache: number;
  L3_cache: number;

  socket: string;
  max_power: number;
  max_memory: number;

  GPU?: GPU;
}

interface GPU extends BaseProcessor {
  max_resolution: { width: number; height: number; refresh_rate: number };
}

interface Connector {
  type: string;
  version: string;
}

interface GraphicCard extends BaseInformation {
  gpu: GPU;

  PCIe: string;
  slot: number;
  connectors: Connector[];

  recommended_power: number;
  power_connector?: string;
}

interface MotherBoard extends BaseInformation {
  socket: string;
  chipset: string;

  memory: MemorySpecification;
  memory_slot: number;

  expansion_slots: Connector[];
}

export { Products };
