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

type GPUType = {
  core_count?: number;
  execution_unit?: number;
  base_frequency?: number;
  boost_frequency?: number;
  extra_cores: GPUCore;

  memory_size?: number;
  memory_type?: string;
  memory_bus?: number;

  tdp: number;
  minimum_psu?: number;

  features: GraphicFeatures;

  extra_cores_json: string | null;
  features_json: string | null;
};

class GPU extends Model<InferAttributes<GPU>, InferCreationAttributes<GPU>> {
  declare id: ForeignKey<string>;

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

  declare extra_cores_json: CreationOptional<string | null>;
  declare features_json: CreationOptional<string | null>;
}

GPU.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    core_count: {
      type: DataTypes.INTEGER,
    },
    execution_unit: {
      type: DataTypes.INTEGER,
    },
    extra_cores: {
      type: DataTypes.VIRTUAL,
      get(): GPUCore | undefined {
        const data = this.getDataValue("extra_cores_json");
        if (data) {
          return JSON.parse(data) as GPUCore;
        }
        return undefined;
      },
      set(value: GPUCore | undefined) {
        if (value) {
          this.setDataValue("extra_cores_json", JSON.stringify(value));
        }
        this.setDataValue("extra_cores_json", null);
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
      type: DataTypes.VIRTUAL,
      get(): GraphicFeatures | null {
        const json = this.getDataValue("features_json");
        if (json) {
          return JSON.parse(json) as GraphicFeatures;
        }
        return null;
      },
      set(value: GraphicFeatures | null) {
        if (value) {
          this.setDataValue("features_json", JSON.stringify(value));
        }
        this.setDataValue("features_json", null);
      },
    },

    extra_cores_json: {
      type: DataTypes.STRING,
    },
    features_json: {
      type: DataTypes.TEXT,
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

PartInformation.hasOne(GPU, {
  foreignKey: "id",
});
GPU.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { GPU, type GraphicFeatures };
