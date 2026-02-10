import { SequelizeOptions } from "sequelize-typescript";

export const getConnectionOptions = (): SequelizeOptions => ({
  dialect: "mysql",
  host: process.env.MYSQL_HOST || process.env.DATABASE_HOST,
  port: Number(process.env.MYSQL_PORT || process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  models: [__dirname + "/**/*.entity{.ts,.js}"],
  define: {
    freezeTableName: true,
    underscored: true,
  },
});
