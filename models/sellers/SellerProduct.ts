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
import { z } from "zod";

type APISellerProduct = {
  name?: string | null;
  price?: number | string | null;
  link?: string | null;
  img?: string | null;
  availability?: boolean | null;
};

class SellerProduct {
  name: string;
  price: number;
  link: string;
  img: string;
  availability: boolean;

  constructor({ name, price, link, img, availability }: APISellerProduct) {
    this.name = z.string().parse(name);
    this.price = z.number().parse(price);
    this.link = z.string().parse(link);
    this.img = z.string().parse(img);
    this.availability = z.boolean().parse(availability);
  }
}

@Table({ ...BaseModelOptions, modelName: Tables.RETAIL_PRODUCT })
class RetailProduct extends Model {
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

export { SellerProduct, RetailProduct, type APISellerProduct };
