import { SequelizeOptions } from "sequelize-typescript";

export const getConnectionOptions = (): SequelizeOptions => ({
  dialect: "mysql",
  host: process.env.MYSQL_HOST || process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || process.env.DATABASE_PORT || 3306),
  username: process.env.DATABASE_USERNAME || "NestjsApp",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || "PC_Builder",
  models: [__dirname + "/**/*.entity{.ts,.js}"],
  define: {
    freezeTableName: true,
    underscored: true,
  },
});
