import {
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { BaseModelOptions, Tables } from "../interface";
import { RetailProductType } from "@/utils/interface/retailer/Product";

@Table({ ...BaseModelOptions, modelName: Tables.RETAIL_PRODUCT })
class RetailProduct extends Model implements RetailProductType {
  @PrimaryKey
  @Column(DataType.STRING)
  declare link: string;

  @Column(DataType.STRING)
  declare retailer: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Default(0)
  @Column(DataType.INTEGER)
  declare price: number;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare img?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare availability: boolean;
}

export { RetailProduct };
