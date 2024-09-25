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
import Cooler from "@/utils/interface/part/Cooler";
import {
  CoolerCPUPlates,
  CoolerCPUPlateType,
} from "@/utils/interface/part/utils";

class CoolerModel
  extends Model<
    InferAttributes<CoolerModel>,
    InferCreationAttributes<CoolerModel>
  >
  implements PartDetailTable<Cooler.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare width: number | null;
  declare length: number | null;
  declare height: number | null;

  declare socket: string | null;
  declare cpu_plate: CoolerCPUPlateType | null;
}

CoolerModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    width: { type: DataTypes.FLOAT },
    length: { type: DataTypes.FLOAT },
    height: { type: DataTypes.FLOAT },

    socket: { type: DataTypes.STRING },
    cpu_plate: {
      type: DataTypes.STRING,
      validate: { isIn: [CoolerCPUPlates] },
    },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.COOLER,
  }
);

PartInformation.hasOne(CoolerModel, {
  foreignKey: "id",
});
CoolerModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { CoolerModel };
