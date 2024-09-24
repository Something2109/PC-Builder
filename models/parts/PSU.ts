import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, PartDefaultScope, Tables } from "../interface";
import { PartInformation } from "./Part";

class PSU extends Model<InferAttributes<PSU>, InferCreationAttributes<PSU>> {
  declare id: ForeignKey<string>;

  declare wattage: number;
  declare efficiency: string;

  declare form_factor: string;
  declare width: number;
  declare length: number;
  declare height: number;

  declare atx_pin: number;
  declare cpu_pin: number;
  declare pcie_pin: number;
  declare sata_pin: number;
  declare peripheral_pin: number;
}

PSU.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    wattage: { type: DataTypes.INTEGER },
    efficiency: { type: DataTypes.STRING },

    form_factor: { type: DataTypes.STRING },
    width: { type: DataTypes.INTEGER },
    length: { type: DataTypes.INTEGER },
    height: { type: DataTypes.INTEGER },

    atx_pin: { type: DataTypes.TINYINT },
    cpu_pin: { type: DataTypes.TINYINT },
    pcie_pin: { type: DataTypes.TINYINT },
    sata_pin: { type: DataTypes.TINYINT },
    peripheral_pin: { type: DataTypes.TINYINT },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.PSU,
  }
);

PartInformation.hasOne(PSU, {
  foreignKey: "id",
});
PSU.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { PSU };
