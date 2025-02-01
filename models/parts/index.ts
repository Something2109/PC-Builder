import { InferAttributes, ModelStatic } from "sequelize";
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
import { Info, Products } from "@/utils/Enum";

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

export const Models: { [key in Products]: ModelCtor<Model> } = {
  [Products.CPU]: CPUModel,
  [Products.GPU]: GPUModel,
  [Products.GRAPHIC_CARD]: GraphicCardModel,
  [Products.MAIN]: MainboardModel,
  [Products.RAM]: RAMModel,
  [Products.SSD]: SSDModel,
  [Products.HDD]: HDDModel,
  [Products.PSU]: PSUModel,
  [Products.CASE]: CaseModel,
  [Products.COOLER]: CoolerModel,
  [Products.AIO]: AIOModel,
  [Products.FAN]: FanModel,
  [Products.CPU_BLOCK]: CPUBlockModel,
  [Products.PUMP]: PumpModel,
  [Products.RADIATOR]: RadiatorModel,
};
