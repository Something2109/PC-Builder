import { InferAttributes, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Models } from "./parts";
import { Article } from "./articles/article";
import { RetailProduct } from "./sellers/SellerProduct";
import { PartInformation } from "./parts/tables/Part";

if (
  !(
    process.env.DATABASE_NAME &&
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USERNAME &&
    process.env.DATABASE_PASSWORD
  )
) {
  throw new Error("Not enough env variables specified");
}

const Connection = new Sequelize({
  database: process.env.DATABASE_NAME,
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  models: [Article, RetailProduct, PartInformation, ...Object.values(Models)],
});

export function IdSubQuery<T extends InferAttributes<any>>(
  name: string,
  options?: WhereOptions<T>
): string {
  return (Connection.getQueryInterface().queryGenerator as any)
    .selectQuery(name, { attributes: ["id"], where: options ?? {} })
    .slice(0, -1);
}

export { Connection };
