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
import HDD from "@/utils/interface/part/HDD";
import {
  HDDFormFactors,
  HDDFormFactorType,
  HDDProtocols,
  HDDProtocolType,
} from "@/utils/interface/utils";

class HDDModel
  extends Model<InferAttributes<HDDModel>, InferCreationAttributes<HDDModel>>
  implements PartDetailTable<HDD.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare rotational_speed: number | null;
  declare read_speed: number | null;
  declare write_speed: number | null;
  declare capacity: number | null;
  declare cache: number | null;

  declare form_factor: HDDFormFactorType | null;
  declare protocol: HDDProtocolType | null;
  declare protocol_version: number | null;
}

HDDModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    rotational_speed: { type: DataTypes.INTEGER },
    read_speed: { type: DataTypes.INTEGER },
    write_speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.TINYINT },
    cache: { type: DataTypes.INTEGER },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [HDDFormFactors] },
    },
    protocol: { type: DataTypes.STRING, validate: { isIn: [HDDProtocols] } },
    protocol_version: { type: DataTypes.TINYINT },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.HDD,
    scopes: {
      filter: (options: HDD.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(HDDModel, {
  foreignKey: "id",
});
HDDModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { HDDModel };
