import { SequelizeOptions } from "sequelize-typescript";
import { InfoModels } from "./parts";
import { Article } from "./articles/article";
import { RetailProduct } from "./sellers/SellerProduct";
import { PartInformation } from "./parts/tables/Part";
import {
  MainboardPCIeModel,
  MainboardStorageConnectorModel,
  MainboardUSBConnectorModel,
} from "./parts/tables/Mainboard";
import {
  CaseMainboardSupportModel,
  CaseRadiatorSupportModel,
  CaseFanSupportModel,
  CaseHardDriveSupportModel,
  CasePSUSupportModel,
} from "./parts/tables/Case";
import { CPUBlockSocketModel } from "./parts/tables/CPUBlock";

export const ConnectionOptions: SequelizeOptions = {
  models: [
    Article,
    RetailProduct,
    PartInformation,
    MainboardPCIeModel,
    MainboardStorageConnectorModel,
    MainboardUSBConnectorModel,
    CaseMainboardSupportModel,
    CaseRadiatorSupportModel,
    CaseFanSupportModel,
    CaseHardDriveSupportModel,
    CasePSUSupportModel,
    CPUBlockSocketModel,
    ...Object.values(InfoModels),
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
