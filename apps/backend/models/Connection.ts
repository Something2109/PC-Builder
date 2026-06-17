import { InferAttributes, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";

import { getConnectionOptions } from "./sequelize.options";

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

const Connection = new Sequelize(getConnectionOptions());

export function IdSubQuery<T extends InferAttributes<any>>(
  name: string,
  options?: WhereOptions<T>
): string {
  return (Connection.getQueryInterface().queryGenerator as any)
    .selectQuery(name, { attributes: ["id"], where: options ?? {} })
    .slice(0, -1);
}

export { Connection };
