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
import PSU from "@/utils/interface/part/PSU";
import {
  PSUFormFactors,
  PSUFormFactorType,
} from "@/utils/interface/part/utils";

class PSUModel
  extends Model<InferAttributes<PSUModel>, InferCreationAttributes<PSUModel>>
  implements PartDetailTable<PSU.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare wattage: number | null;
  declare efficiency: string | null;

  declare form_factor: PSUFormFactorType | null;
  declare width: number | null;
  declare length: number | null;
  declare height: number | null;

  declare atx_pin: number | null;
  declare cpu_pin: number | null;
  declare pcie_pin: number | null;
  declare sata_pin: number | null;
  declare peripheral_pin: number | null;
}

PSUModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    wattage: { type: DataTypes.INTEGER },
    efficiency: { type: DataTypes.STRING },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [PSUFormFactors] },
    },
    width: { type: DataTypes.INTEGER },
    length: { type: DataTypes.INTEGER },
    height: { type: DataTypes.INTEGER },

    atx_pin: { type: DataTypes.TINYINT },
    cpu_pin: { type: DataTypes.TINYINT },
    pcie_pin: { type: DataTypes.TINYINT },
    sata_pin: { type: DataTypes.TINYINT },
    peripheral_pin: { type: DataTypes.TINYINT },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.PSU,
  }
);

PartInformation.hasOne(PSUModel, {
  foreignKey: "id",
});
PSUModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { PSUModel };
