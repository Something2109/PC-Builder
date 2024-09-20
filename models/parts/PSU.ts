import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
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

    wattage: { type: DataTypes.INTEGER, allowNull: false },
    efficiency: { type: DataTypes.STRING, allowNull: false },

    form_factor: { type: DataTypes.STRING, allowNull: false },
    width: { type: DataTypes.INTEGER, allowNull: false },
    length: { type: DataTypes.INTEGER, allowNull: false },
    height: { type: DataTypes.INTEGER, allowNull: false },

    atx_pin: { type: DataTypes.TINYINT, allowNull: false },
    cpu_pin: { type: DataTypes.TINYINT, allowNull: false },
    pcie_pin: { type: DataTypes.TINYINT, allowNull: false },
    sata_pin: { type: DataTypes.TINYINT, allowNull: false },
    peripheral_pin: { type: DataTypes.TINYINT, allowNull: false },
  },
  {
    ...BaseModelOptions,
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
