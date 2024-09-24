import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, PartDefaultScope, Tables } from "../interface";
import { PartInformation } from "./Part";

type FanSize = 120 | 140;

type AIOSize = 120 | 140 | 240 | 280 | 360 | 420;

class Fan extends Model<InferAttributes<Fan>, InferCreationAttributes<Fan>> {
  declare id: ForeignKey<string>;

  declare width: number;
  declare length: number;
  declare height: number;
}

Fan.init(
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
    defaultScope: PartDefaultScope,
    modelName: Tables.FAN,
  }
);

PartInformation.hasOne(Fan, {
  foreignKey: "id",
});
Fan.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { Fan };
