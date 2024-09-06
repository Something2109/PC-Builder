import { DataTypes } from "sequelize";
import {
  BasePartTable,
  BaseInformation,
  BaseModelOptions,
  Tables,
} from "../interface";

type APICPUCore = {
  [key in string]: {
    count?: number;

    base_frequency: number;
    turbo_frequency?: number;
  };
};

class CPU extends BasePartTable {
  declare socket: string;
  declare total_cores: number;
  declare total_threads: number;
  declare base_frequency?: number;
  declare turbo_frequency?: number;
  declare cores?: APICPUCore;

  declare L2_cache?: number;
  declare L3_cache?: number;

  declare max_memory?: number;
  declare max_memory_channel?: number;
  declare max_memory_bandwidth?: number;

  declare tdp: number;
  declare lithography: string;
}

CPU.init(
  {
    ...BaseInformation,

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
      type: DataTypes.STRING,
      async get(): Promise<APICPUCore | null> {
        const json = this.getDataValue("cores");
        if (json) {
          return JSON.parse(json) as APICPUCore;
        }
        return json;
      },
      async set(value: APICPUCore | undefined) {
        if (value) {
          const json = JSON.stringify(value);
          this.setDataValue("cores", json);
        } else {
          this.setDataValue("cores", null);
        }
      },
      allowNull: true,
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

export { CPU, type APICPUCore };
