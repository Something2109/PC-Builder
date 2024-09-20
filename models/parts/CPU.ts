import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { BaseModelOptions, Tables } from "../interface";
import { PartInformation } from "./Part";
import { PartType } from "@/utils/interface/Parts";

class CPU
  extends Model<InferAttributes<CPU>, InferCreationAttributes<CPU>>
  implements PartType.CPU.Info
{
  declare id: ForeignKey<string>;
  declare family: string;

  declare socket: string;
  declare total_cores: number;
  declare total_threads: number;
  declare base_frequency?: number;
  declare turbo_frequency?: number;
  declare cores?: PartType.CPU.Core;

  declare L2_cache?: number;
  declare L3_cache?: number;

  declare max_memory?: number;
  declare max_memory_channel?: number;
  declare max_memory_bandwidth?: number;

  declare tdp: number;
  declare lithography: string;

  declare core_json: CreationOptional<string | null>;
}

CPU.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    family: {
      type: DataTypes.STRING,
    },

    socket: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_cores: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_threads: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    base_frequency: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    turbo_frequency: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cores: {
      type: DataTypes.VIRTUAL,
      get(): PartType.CPU.Core | undefined {
        const json = this.getDataValue("core_json");
        if (json) {
          return JSON.parse(json) as PartType.CPU.Core;
        }
        return undefined;
      },
      set(value: PartType.CPU.Core | undefined) {
        if (value) {
          const json = JSON.stringify(value);
          this.setDataValue("core_json", json);
        } else {
          this.setDataValue("core_json", null);
        }
      },
    },
    L2_cache: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    L3_cache: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    max_memory: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    max_memory_channel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_memory_bandwidth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    tdp: {
      type: DataTypes.INTEGER,
    },

    lithography: {
      type: DataTypes.STRING,
    },

    core_json: {
      type: DataTypes.STRING,
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.CPU,
    validate: {
      coreValidate() {
        if ((this.base_frequency === null) !== (this.cores === null)) {
          throw new Error("Not enough core information provided");
        }
      },
    },
  }
);

PartInformation.hasOne(CPU, {
  foreignKey: "id",
});
CPU.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { CPU };
