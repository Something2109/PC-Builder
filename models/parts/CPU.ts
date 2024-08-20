import { DataTypes, Model } from "sequelize";
import { Connection } from "../Database";
import { Tables } from "../interface";

type APICPUCore = {
  [key in string]: {
    count?: number;

    base_frequency: number;
    turbo_frequency?: number;
  };
};

type APICPUProperties = {
  name: string;
  brand: string;
  family: string;
  series: string;
  launch_date?: Date;

  socket: string;
  total_cores: number;
  total_threads: number;
  base_frequency?: number;
  turbo_frequency?: number;
  cores?: string;

  L2_cache?: number;
  L3_cache?: number;

  max_memory?: number;
  max_memory_channel?: number;
  max_memory_bandwidth?: number;

  tdp: number;
  lithography: string;
};

class CPU extends Model {
  declare name: string;
  declare brand: string;
  declare family: string;
  declare series: string;
  declare launch_date?: Date;

  declare socket: string;
  declare total_cores: number;
  declare total_threads: number;
  declare base_frequency?: number;
  declare turbo_frequency?: number;
  declare cores: APICPUCore;

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
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    series: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    launch_date: {
      type: DataTypes.DATE,
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
    sequelize: Connection,
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

export { CPU, type APICPUCore, type APICPUProperties };
