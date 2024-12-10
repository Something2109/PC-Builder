import { SequelizeModule } from "@nestjs/sequelize";
import { PartInformation } from "@/models/parts/tables/Part";
import { Article } from "@/models/articles/article";
import { RetailProduct } from "@/models/sellers/SellerProduct";
import { Models as PartModels } from "@/models/parts";

export const DBModule = SequelizeModule.forRoot({
  dialect: "mysql",
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT ?? "3306"),
  username: process.env.DATABASE_USERNAME ?? "root",
  password: process.env.DATABASE_PASSWORD ?? "12345678",
  database: process.env.DATABASE_NAME ?? "PC_Builder",
  models: [
    Article,
    RetailProduct,
    PartInformation,
    ...Object.values(PartModels),
  ],
});
