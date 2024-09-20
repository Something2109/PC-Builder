import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import Validate from "../validate";
import { BaseModelOptions, Tables } from "../interface";

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

class RetailProduct extends Model<
  InferAttributes<RetailProduct>,
  InferCreationAttributes<RetailProduct>
> {
  declare link: string;
  declare retailer: string;
  declare name: string;
  declare price: number;
  declare img?: string;
  declare availability: boolean;
}

RetailProduct.init(
  {
    link: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    retailer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { ...BaseModelOptions, modelName: Tables.RETAIL_PRODUCT }
);

export { SellerProduct, RetailProduct, type APISellerProduct };
