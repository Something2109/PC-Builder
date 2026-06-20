import { Column, DataType, Default, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";

import { RetailProductType } from "@pc-builder/shared/retailer/Product";

import { Tables } from "../interface";

@Table({ modelName: Tables.RETAIL_PRODUCT })
export default class RetailProduct extends Model implements RetailProductType {
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
