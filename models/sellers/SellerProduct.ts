import {
  Column,
  DataType,
  Default,
  Model,
  NotNull,
  Table,
} from "sequelize-typescript";
import Validate from "../validate";
import { BaseModelOptions, Connection, Tables } from "../interface";

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
    this.name = Validate.string(name);
    this.price = Validate.number(price);
    this.link = Validate.string(link);
    this.img = Validate.string(img);
    this.availability = Validate.boolean(availability);
  }
}

@Table({ ...BaseModelOptions, modelName: Tables.RETAIL_PRODUCT })
class RetailProduct extends Model {
  @Column(DataType.STRING)
  declare link: string;

  @Column(DataType.STRING)
  declare retailer: string;

  @Column(DataType.STRING)
  @NotNull
  declare name: string;

  @Column(DataType.INTEGER)
  @NotNull
  @Default(0)
  declare price: number;

  @Column({ type: DataType.STRING, validate: { isUrl: true } })
  declare img?: string;

  @Column(DataType.BOOLEAN)
  @Default(false)
  declare availability: boolean;
}

Connection.addModels([RetailProduct]);

export { SellerProduct, RetailProduct, type APISellerProduct };
