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

class AIO extends Model<InferAttributes<AIO>, InferCreationAttributes<AIO>> {
  declare id: ForeignKey<string>;
}

AIO.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    ...BaseModelOptions,
    ...PartDefaultScope,
    modelName: Tables.AIO,
  }
);

PartInformation.hasOne(AIO, {
  foreignKey: "id",
});
AIO.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { AIO };
