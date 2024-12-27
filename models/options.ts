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

export const ConnectionOptions: SequelizeOptions = {
  models: [
    Article,
    RetailProduct,
    PartInformation,
    MainboardPCIeModel,
    MainboardStorageConnectorModel,
    MainboardUSBConnectorModel,
    ...Object.values(Models),
  ],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
