import { DataTypes } from "sequelize";
import {
  BasePartTable,
  BaseInformation,
  BaseModelOptions,
  Tables,
} from "../interface";

class RAM extends BasePartTable {
  declare speed: number;
  declare capacity: number;
  declare voltage: number;
  declare latency: number[];
  declare kit: number;

  declare type: string;
  declare form_factor: string;
}

RAM.init(
  {
    ...BaseInformation,

    speed: { type: DataTypes.INTEGER, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    voltage: { type: DataTypes.FLOAT, allowNull: false },
    latency: {
      type: DataTypes.JSON,
      allowNull: false,
      async get(): Promise<number[]> {
        const data = this.getDataValue("latency");

        return JSON.parse(data) as number[];
      },
      async set(value: number[]) {
        this.setDataValue("latency", JSON.stringify(value));
      },
    },
    kit: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },

    type: { type: DataTypes.STRING, allowNull: false },
    form_factor: { type: DataTypes.STRING, allowNull: false },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.RAM,
  }
);

export { RAM };
