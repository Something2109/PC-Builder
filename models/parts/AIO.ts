import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import AIO from "@/utils/interface/part/AIO";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../interface";
import { PartInformation } from "./Part";
import {
  AIOFormFactors,
  AIOFormFactorType,
  CoolerCPUPlates,
  CoolerCPUPlateType,
} from "@/utils/interface/part/utils";

class AIOModel
  extends Model<InferAttributes<AIOModel>, InferCreationAttributes<AIOModel>>
  implements PartDetailTable<AIO.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare form_factor: AIOFormFactorType | null;
  declare radiator_width: number | null;
  declare radiator_length: number | null;
  declare radiator_height: number | null;

  declare socket: string | null;
  declare cpu_plate: CoolerCPUPlateType | null;

  declare pump_width: number | null;
  declare pump_length: number | null;
  declare pump_height: number | null;
  declare pump_speed: number | null;
}

AIOModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [AIOFormFactors] },
    },
    radiator_width: { type: DataTypes.FLOAT },
    radiator_length: { type: DataTypes.FLOAT },
    radiator_height: { type: DataTypes.FLOAT },

    socket: { type: DataTypes.STRING },
    cpu_plate: {
      type: DataTypes.STRING,
      validate: { isIn: [CoolerCPUPlates] },
    },

    pump_width: { type: DataTypes.FLOAT },
    pump_length: { type: DataTypes.FLOAT },
    pump_height: { type: DataTypes.FLOAT },
    pump_speed: { type: DataTypes.FLOAT },
  },
  {
    ...BaseModelOptions,
    ...PartDefaultScope,
    modelName: Tables.AIO,
  }
);

PartInformation.hasOne(AIOModel, {
  foreignKey: "id",
});
AIOModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { AIOModel as AIO };
