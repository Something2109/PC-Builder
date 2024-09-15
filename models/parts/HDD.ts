import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";

class HDD extends Model<InferAttributes<HDD>, InferCreationAttributes<HDD>> {
  declare id: ForeignKey<string>;

  declare rotational_speed: number;
  declare read_speed: number;
  declare write_speed: number;
  declare capacity: number;
  declare cache: number;

  declare form_factor: string;
  declare protocol: string;
  declare protocol_version: number;
}

HDD.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    rotational_speed: { type: DataTypes.INTEGER },
    read_speed: { type: DataTypes.INTEGER },
    write_speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.TINYINT },
    cache: { type: DataTypes.INTEGER },

    form_factor: { type: DataTypes.STRING, allowNull: false },
    protocol: { type: DataTypes.STRING, allowNull: false },
    protocol_version: { type: DataTypes.TINYINT, allowNull: false },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.HDD,
  }
);

PartInformation.hasOne(HDD, {
  foreignKey: "id",
});
HDD.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { HDD };
