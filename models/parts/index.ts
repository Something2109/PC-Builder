import { Model, ModelCtor } from "sequelize-typescript";
import { CPUModel } from "./tables/CPU";
import { GPUModel } from "./tables/GPU";
import { GraphicCardModel } from "./tables/GraphicCard";
import { MainboardModel } from "./tables/Mainboard";
import { RAMModel } from "./tables/RAM";
import { SSDModel } from "./tables/SSD";
import { HDDModel } from "./tables/HDD";
import { PSUModel } from "./tables/PSU";
import { CaseModel } from "./tables/Case";
import { CoolerModel } from "./tables/Cooler";
import { AIOModel } from "./tables/AIO";
import { FanModel } from "./tables/Fan";
import { CPUBlockModel } from "./tables/CPUBlock";
import { PumpModel } from "./tables/Pump";
import { RadiatorModel } from "./tables/Radiator";
import { Info } from "@/utils/Enum";

export const InfoModels: { [key in Info]: ModelCtor<Model> } = {
  [Info.CPU]: CPUModel,
  [Info.GPU]: GPUModel,
  [Info.GRAPHIC_CARD]: GraphicCardModel,
  [Info.MAIN]: MainboardModel,
  [Info.RAM]: RAMModel,
  [Info.SSD]: SSDModel,
  [Info.HDD]: HDDModel,
  [Info.PSU]: PSUModel,
  [Info.CASE]: CaseModel,
  [Info.COOLER]: CoolerModel,
  [Info.AIO]: AIOModel,
  [Info.FAN]: FanModel,
  [Info.CPU_BLOCK]: CPUBlockModel,
  [Info.PUMP]: PumpModel,
  [Info.RADIATOR]: RadiatorModel,
};
