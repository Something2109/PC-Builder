import { DataTypes } from "sequelize";
import {
  BaseInformation,
  BaseModelOptions,
  BasePartTable,
  Tables,
} from "../interface";

type GPUCore = {
  [key in string]: {
    generation?: number;
    count?: number;
  };
};

type GraphicFeatures = {
  DirectX?: string;
  OpenGL?: string;
  OpenCL?: string;
  Vulkan?: string;
  CUDA?: string;
};

class GPU extends BasePartTable {
  declare core_count?: number;
  declare execution_unit?: number;
  declare base_frequency?: number;
  declare boost_frequency?: number;
  declare extra_cores: GPUCore;

  declare memory_size?: number;
  declare memory_type?: string;
  declare memory_bus?: number;

  declare tdp: number;
  declare minimum_psu?: number;

  declare features: GraphicFeatures;
}

GPU.init(
  {
    ...BaseInformation,

    core_count: {
      type: DataTypes.INTEGER,
    },
    execution_unit: {
      type: DataTypes.INTEGER,
    },
    extra_cores: {
      type: DataTypes.STRING,
      async get(): Promise<GPUCore | undefined> {
        const data = this.getDataValue("extra_cores");
        if (data) {
          return JSON.parse(data) as GPUCore;
        }
        return undefined;
      },
      async set(value: GPUCore | undefined) {
        if (value) {
          this.setDataValue("extra_cores", JSON.stringify(value));
        } else {
          this.setDataValue("extra_cores", null);
        }
      },
    },
    base_frequency: {
      type: DataTypes.FLOAT,
    },
    boost_frequency: {
      type: DataTypes.FLOAT,
    },

    memory_size: {
      type: DataTypes.FLOAT,
    },
    memory_type: {
      type: DataTypes.STRING,
    },
    memory_bus: {
      type: DataTypes.INTEGER,
    },

    tdp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    features: {
      type: DataTypes.TEXT,
      async get(): Promise<GraphicFeatures> {
        const json = this.getDataValue("features");

        return JSON.parse(json) as GraphicFeatures;
      },
      async set(value: GraphicFeatures) {
        this.setDataValue("features", JSON.stringify(value));
      },
    },
  },
  {
    ...BaseModelOptions,
    modelName: Tables.GPU,
    validate: {
      coreValidate() {
        if (!this.core_count && !this.execution_unit) {
          throw new Error("Not enough core information provided");
        }
        if (!this.base_frequency && !this.boost_frequency) {
          throw new Error("Not enough frequency information provided");
        }
      },
    },
  }
);

export { GPU, type GraphicFeatures };
