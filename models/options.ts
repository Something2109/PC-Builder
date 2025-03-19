import { SequelizeOptions } from "sequelize-typescript";
import { ArticleModel } from "./articles/article";
import { UserModel } from "./user/User";
import { RetailProduct } from "./sellers/SellerProduct";
import { PartInformation } from "./parts/tables/Part";
import { CPUModel } from "./parts/tables/CPU";
import { GPUModel } from "./parts/tables/GPU";
import { GraphicCardModel } from "./parts/tables/GraphicCard";
import {
  MainboardModel,
  MainboardPCIeModel,
  MainboardStorageConnectorModel,
  MainboardUSBConnectorModel,
} from "./parts/tables/Mainboard";
import { RAMModel } from "./parts/tables/RAM";
import { SSDModel } from "./parts/tables/SSD";
import { HDDModel } from "./parts/tables/HDD";
import { PSUModel } from "./parts/tables/PSU";
import {
  CaseModel,
  CaseMainboardSupportModel,
  CaseRadiatorSupportModel,
  CaseFanSupportModel,
  CaseHardDriveSupportModel,
  CasePSUSupportModel,
} from "./parts/tables/Case";
import { CoolerModel } from "./parts/tables/Cooler";
import { AIOModel } from "./parts/tables/AIO";
import { FanModel } from "./parts/tables/Fan";
import { CPUBlockModel, CPUBlockSocketModel } from "./parts/tables/CPUBlock";
import { PumpModel } from "./parts/tables/Pump";
import { RadiatorModel } from "./parts/tables/Radiator";

export const ConnectionOptions: SequelizeOptions = {
  models: [
    ArticleModel,
    UserModel,
    RetailProduct,
    PartInformation,
    CPUModel,
    GPUModel,
    GraphicCardModel,
    MainboardModel,
    RAMModel,
    SSDModel,
    HDDModel,
    PSUModel,
    CaseModel,
    CoolerModel,
    AIOModel,
    FanModel,
    CPUBlockModel,
    PumpModel,
    RadiatorModel,
    MainboardPCIeModel,
    MainboardStorageConnectorModel,
    MainboardUSBConnectorModel,
    CaseMainboardSupportModel,
    CaseRadiatorSupportModel,
    CaseFanSupportModel,
    CaseHardDriveSupportModel,
    CasePSUSupportModel,
    CPUBlockSocketModel,
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
