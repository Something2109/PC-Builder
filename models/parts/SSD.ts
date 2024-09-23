import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";

class SSD extends Model<InferAttributes<SSD>, InferCreationAttributes<SSD>> {
  declare id: ForeignKey<string>;

  declare memory_type: string;
  declare read_speed: number;
  declare write_speed: number;
  declare capacity: number;
  declare cache: number;
  declare tbw: number;

  declare form_factor: string;
  declare protocol: string;
  declare protocol_version: number;
}

SSD.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    memory_type: { type: DataTypes.STRING },
    read_speed: { type: DataTypes.INTEGER },
    write_speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.TINYINT },
    cache: { type: DataTypes.INTEGER },
    tbw: { type: DataTypes.INTEGER },

    form_factor: { type: DataTypes.STRING },
    protocol: { type: DataTypes.STRING },
    protocol_version: { type: DataTypes.TINYINT },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.RAM,
  }
);

PartInformation.hasOne(SSD, {
  foreignKey: "id",
});
SSD.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { SSD };
