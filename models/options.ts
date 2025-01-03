import { SequelizeOptions } from "sequelize-typescript";
import { Models } from "./parts";
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
    ...Object.values(Models),
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
