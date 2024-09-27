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
} from "../../interface";
import { PartInformation } from "./Part";
import CPU from "@/utils/interface/part/CPU";

class CPUModel
  extends Model<InferAttributes<CPUModel>, InferCreationAttributes<CPUModel>>
  implements PartDetailTable<CPU.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;
  declare family: string | null;

  declare socket: string | null;
  declare total_cores: number | null;
  declare total_threads: number | null;
  declare base_frequency: number | null;
  declare turbo_frequency: number | null;
  declare cores: CPU.Core | null;

  declare L2_cache: number | null;
  declare L3_cache: number | null;

  declare max_memory: number | null;
  declare max_memory_channel: number | null;
  declare max_memory_bandwidth: number | null;

  declare tdp: number | null;
  declare lithography: string | null;

  declare core_json: CreationOptional<string | null>;
}

CPUModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    family: { type: DataTypes.STRING },

    socket: { type: DataTypes.STRING },
    total_cores: { type: DataTypes.TINYINT },
    total_threads: { type: DataTypes.TINYINT },
    base_frequency: { type: DataTypes.FLOAT },
    turbo_frequency: { type: DataTypes.FLOAT },
    cores: {
      type: DataTypes.VIRTUAL,
      get(): CPU.Core | undefined {
        const json = this.getDataValue("core_json");
        if (json) {
          return JSON.parse(json) as CPU.Core;
        }
        return undefined;
      },
      set(value: CPU.Core | undefined) {
        if (value) {
          const json = JSON.stringify(value);
          this.setDataValue("core_json", json);
        } else {
          this.setDataValue("core_json", null);
        }
      },
    },

    L2_cache: { type: DataTypes.FLOAT },
    L3_cache: { type: DataTypes.FLOAT },

    max_memory: { type: DataTypes.FLOAT },
    max_memory_channel: { type: DataTypes.INTEGER },
    max_memory_bandwidth: { type: DataTypes.FLOAT },

    tdp: { type: DataTypes.INTEGER },
    lithography: { type: DataTypes.STRING },

    core_json: { type: DataTypes.STRING },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.CPU,
    validate: {
      coresValidate() {
        if (
          this.base_frequency &&
          this.turbo_frequency &&
          this.base_frequency > this.turbo_frequency
        ) {
          throw new Error("Base frequency cannot be larger than the turbo");
        }
      },
    },
    scopes: {
      filter: (options: CPU.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(CPUModel, {
  foreignKey: "id",
});
CPUModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { CPUModel };
