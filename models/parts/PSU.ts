import { DataTypes } from "sequelize";
import {
  BasePartTable,
  BaseInformation,
  BaseModelOptions,
  Tables,
} from "../interface";

class PSU extends BasePartTable {
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
    ...BaseInformation,

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

export { PSU };
