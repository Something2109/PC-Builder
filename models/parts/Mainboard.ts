import { DataTypes } from "sequelize";
import {
  BaseInformation,
  BaseModelOptions,
  BasePartTable,
  Tables,
} from "../interface";
class Mainboard extends BasePartTable {
  declare form_factor: string;

  declare socket: string;

  declare ram_type: string;
  declare expansion_slots: number;

  declare io_ports: {};
}

Mainboard.init(
  {
    ...BaseInformation,

    socket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.MAIN,
  }
);

export { Mainboard };
