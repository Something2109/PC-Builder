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
import { Infos } from "@/utils/Enum";

export const InfoModels: { [key in Infos]: ModelCtor<Model> } = {
  [Infos.CPU]: CPUModel,
  [Infos.GPU]: GPUModel,
  [Infos.GRAPHIC_CARD]: GraphicCardModel,
  [Infos.MAIN]: MainboardModel,
  [Infos.RAM]: RAMModel,
  [Infos.SSD]: SSDModel,
  [Infos.HDD]: HDDModel,
  [Infos.PSU]: PSUModel,
  [Infos.CASE]: CaseModel,
  [Infos.COOLER]: CoolerModel,
  [Infos.AIO]: AIOModel,
  [Infos.FAN]: FanModel,
  [Infos.CPU_BLOCK]: CPUBlockModel,
  [Infos.PUMP]: PumpModel,
  [Infos.RADIATOR]: RadiatorModel,
};
