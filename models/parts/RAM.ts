import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, PartDefaultScope, Tables } from "../interface";
import { PartInformation } from "./Part";

class RAM extends Model<InferAttributes<RAM>, InferCreationAttributes<RAM>> {
  declare id: ForeignKey<string>;

  declare speed: number;
  declare capacity: number;
  declare voltage: number;
  declare latency: number[];
  declare kit: number;

  declare type: string;
  declare form_factor: string;

  declare latency_json: string;
}

RAM.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.INTEGER },
    voltage: { type: DataTypes.FLOAT },
    latency: {
      type: DataTypes.VIRTUAL,
      async get(): Promise<number[]> {
        const data = this.getDataValue("latency_json");

        return JSON.parse(data) as number[];
      },
      async set(value: number[]) {
        this.setDataValue("latency_json", JSON.stringify(value));
      },
    },
    kit: { type: DataTypes.TINYINT, defaultValue: 1 },

    type: { type: DataTypes.STRING },
    form_factor: { type: DataTypes.STRING },
    latency_json: { type: DataTypes.STRING },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.RAM,
  }
);

PartInformation.hasOne(RAM, {
  foreignKey: "id",
});
RAM.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { RAM };
