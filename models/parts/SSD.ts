import { DataTypes } from "sequelize";
import {
  BasePartTable,
  BaseInformation,
  BaseModelOptions,
  Tables,
} from "../interface";

class RAM extends BasePartTable {
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

RAM.init(
  {
    ...BaseInformation,

    memory_type: { type: DataTypes.STRING, allowNull: false },
    read_speed: { type: DataTypes.INTEGER },
    write_speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.TINYINT },
    cache: { type: DataTypes.INTEGER },
    tbw: { type: DataTypes.INTEGER },

    form_factor: { type: DataTypes.STRING, allowNull: false },
    protocol: { type: DataTypes.STRING, allowNull: false },
    protocol_version: { type: DataTypes.TINYINT, allowNull: false },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.RAM,
  }
);

export { RAM };
