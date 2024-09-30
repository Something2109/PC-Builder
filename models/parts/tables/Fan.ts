import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import {
  BaseModelOptions,
  PartDefaultScope,
  PartDetailTable,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import Fan from "@/utils/interface/part/Fan";
import {
  FanBearings,
  FanBearingType,
  FanFormFactors,
  FanFormFactorType,
} from "@/utils/interface/utils";

class FanModel
  extends Model<InferAttributes<FanModel>, InferCreationAttributes<FanModel>>
  implements PartDetailTable<Fan.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare form_factor: FanFormFactorType | null;
  declare width: number | null;
  declare length: number | null;
  declare height: number | null;

  declare voltage: number | null;
  declare speed: number | null;
  declare airflow: number | null;
  declare noise: number | null;
  declare static_pressure: number | null;
  declare bearing: FanBearingType | null;
}

FanModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [FanFormFactors] },
    },

    width: { type: DataTypes.FLOAT },
    length: { type: DataTypes.FLOAT },
    height: { type: DataTypes.FLOAT },

    voltage: { type: DataTypes.FLOAT },
    speed: { type: DataTypes.INTEGER },
    airflow: { type: DataTypes.FLOAT },
    noise: { type: DataTypes.FLOAT },
    static_pressure: { type: DataTypes.FLOAT },
    bearing: { type: DataTypes.STRING, validate: { isIn: [FanBearings] } },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.FAN,
    scopes: {
      summary: { attributes: [...Fan.SummaryAttributes] },
      filter: (options: Fan.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(FanModel, {
  foreignKey: "id",
});
FanModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { FanModel };
