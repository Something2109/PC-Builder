import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../interface";
import { PartInformation } from "./Part";
import GPU from "@/utils/interface/part/GPU";

class GPUModel
  extends Model<InferAttributes<GPUModel>, InferCreationAttributes<GPUModel>>
  implements PartDetailTable<GPU.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;
  declare family: string | null;

  declare core_count: number | null;
  declare execution_unit: number | null;
  declare base_frequency: number | null;
  declare boost_frequency: number | null;
  declare extra_cores: GPU.Core | null;

  declare memory_size: number | null;
  declare memory_type: string | null;
  declare memory_bus: number | null;

  declare tdp: number | null;

  declare features: GPU.Features | null;

  declare extra_cores_json: CreationOptional<string | null>;
  declare features_json: CreationOptional<string | null>;
}

GPUModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    family: { type: DataTypes.STRING },

    core_count: { type: DataTypes.INTEGER },
    execution_unit: { type: DataTypes.INTEGER },
    extra_cores: {
      type: DataTypes.VIRTUAL,
      get(): GPU.Core | null {
        const data = this.getDataValue("extra_cores_json");
        if (data) {
          return JSON.parse(data) as GPU.Core;
        }
        return null;
      },
      set(value?: GPU.Core | null) {
        if (value) {
          this.setDataValue("extra_cores_json", JSON.stringify(value));
        }
        this.setDataValue("extra_cores_json", null);
      },
    },
    base_frequency: { type: DataTypes.FLOAT },
    boost_frequency: { type: DataTypes.FLOAT },

    memory_size: { type: DataTypes.FLOAT },
    memory_type: { type: DataTypes.STRING },
    memory_bus: { type: DataTypes.INTEGER },

    tdp: { type: DataTypes.INTEGER },

    features: {
      type: DataTypes.VIRTUAL,
      get(): GPU.Features | null {
        const json = this.getDataValue("features_json");
        if (json) {
          return JSON.parse(json) as GPU.Features;
        }
        return null;
      },
      set(value: GPU.Features | null) {
        if (value) {
          this.setDataValue("features_json", JSON.stringify(value));
        }
        this.setDataValue("features_json", null);
      },
    },

    extra_cores_json: { type: DataTypes.STRING },
    features_json: { type: DataTypes.TEXT },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
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

PartInformation.hasOne(GPUModel, {
  foreignKey: "id",
});
GPUModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

PartInformation.hasOne(GPUModel, {
  foreignKey: "id",
});
GPUModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { GPUModel as GPU };
