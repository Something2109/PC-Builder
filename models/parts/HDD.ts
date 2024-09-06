import { DataTypes } from "sequelize";
import {
  BaseInformation,
  BaseModelOptions,
  BasePartTable,
  Tables,
} from "../interface";

class HDD extends BasePartTable {
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
    ...BaseInformation,

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

export { HDD };
