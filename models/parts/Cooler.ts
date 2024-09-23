import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";

type FanSize = 120 | 140;

type AIOSize = 120 | 140 | 240 | 280 | 360 | 420;

class Cooler extends Model<
  InferAttributes<Cooler>,
  InferCreationAttributes<Cooler>
> {
  declare id: ForeignKey<string>;

  declare width: number;
  declare length: number;
  declare height: number;
}

Cooler.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    width: {
      type: DataTypes.FLOAT,
    },
    length: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.COOLER,
  }
);

PartInformation.hasOne(Cooler, {
  foreignKey: "id",
});
Cooler.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { Cooler };
