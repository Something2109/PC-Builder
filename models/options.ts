import { SequelizeOptions } from "sequelize-typescript";
import { Models } from "./parts";
import { Article } from "./articles/article";
import { RetailProduct } from "./sellers/SellerProduct";
import { PartInformation } from "./parts/tables/Part";

export const ConnectionOptions: SequelizeOptions = {
  models: [Article, RetailProduct, PartInformation, ...Object.values(Models)],
  define: {
    freezeTableName: true,
    underscored: true,
  },
};
