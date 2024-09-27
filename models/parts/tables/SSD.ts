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
import SSD from "@/utils/interface/part/SSD";
import {
  SSDFormFactors,
  SSDFormFactorType,
  SSDInterfaces,
  SSDInterfaceType,
  SSDProtocols,
  SSDProtocolType,
} from "@/utils/interface/part/utils";

class SSDModel
  extends Model<InferAttributes<SSDModel>, InferCreationAttributes<SSDModel>>
  implements PartDetailTable<SSD.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare memory_type: string | null;
  declare read_speed: number | null;
  declare write_speed: number | null;
  declare capacity: number | null;
  declare cache: number | null;
  declare tbw: number | null;

  declare form_factor: SSDFormFactorType | null;
  declare protocol: SSDProtocolType | null;
  declare interface: SSDInterfaceType | null;
}

SSDModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    memory_type: { type: DataTypes.STRING },
    read_speed: { type: DataTypes.INTEGER },
    write_speed: { type: DataTypes.INTEGER },
    capacity: { type: DataTypes.TINYINT },
    cache: { type: DataTypes.INTEGER },
    tbw: { type: DataTypes.INTEGER },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [SSDFormFactors] },
    },
    protocol: { type: DataTypes.STRING, validate: { isIn: [SSDProtocols] } },
    interface: { type: DataTypes.STRING, validate: { isIn: [SSDInterfaces] } },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.RAM,
    scopes: {
      filter: (options: SSD.FilterOptions) => ({ where: options }),
      detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
    },
  }
);

PartInformation.hasOne(SSDModel, {
  foreignKey: "id",
});
SSDModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { SSDModel };
