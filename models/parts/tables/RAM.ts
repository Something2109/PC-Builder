import {
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
import RAM from "@/utils/interface/part/RAM";
import {
  RAMFormFactors,
  RAMFormFactorType,
  RAMProtocols,
  RAMProtocolType,
} from "@/utils/interface/utils";

class RAMModel
  extends Model<InferAttributes<RAMModel>, InferCreationAttributes<RAMModel>>
  implements PartDetailTable<RAM.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare speed: number | null;
  declare capacity: number | null;
  declare voltage: number | null;
  declare latency: number[] | null;
  declare kit: number | null;

  declare form_factor: RAMFormFactorType | null;
  declare protocol: RAMProtocolType | null;

  declare latency_json: string | null;
}

RAMModel.init(
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
      async get(): Promise<number[] | null> {
        const data = this.getDataValue("latency_json");
        if (data) {
          return JSON.parse(data) as number[];
        }
        return null;
      },
      async set(value: number[] | null) {
        this.setDataValue("latency_json", value ? JSON.stringify(value) : null);
      },
    },
    kit: { type: DataTypes.TINYINT, defaultValue: 1 },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [RAMFormFactors] },
    },
    protocol: { type: DataTypes.STRING, validate: { isIn: [RAMProtocols] } },

    latency_json: { type: DataTypes.STRING, get: () => undefined },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.RAM,
    scopes: {
      summary: { attributes: [...RAM.SummaryAttributes] },
      filter: (options: RAM.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(RAMModel, {
  foreignKey: "id",
});
RAMModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { RAMModel };
