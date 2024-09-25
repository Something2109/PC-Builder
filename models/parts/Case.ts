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
} from "../interface";
import { PartInformation } from "./Part";
import {
  CaseFormFactors,
  CaseFormFactorType,
  MainboardFormFactorType,
  PSUFormFactorType,
} from "@/utils/interface/part/utils";
import Case from "@/utils/interface/part/Case";

class CaseModel
  extends Model<InferAttributes<CaseModel>, InferCreationAttributes<CaseModel>>
  implements PartDetailTable<Case.Info>
{
  declare id: ForeignKey<PartInformation["id"]>;

  declare form_factor: CaseFormFactorType | null;
  declare width: number | null;
  declare length: number | null;
  declare height: number | null;

  declare io_ports: {} | null;

  declare mb_support: MainboardFormFactorType[] | null;
  declare expansion_slot: number | null;

  declare max_cooler_height: number | null;

  declare aio_support: Case.AIOSupport | null;
  declare fan_support: Case.FanSupport | null;

  declare hard_drive_support: Case.HardDriveSupport | null;

  declare psu_support: PSUFormFactorType | null;
  declare max_psu_length: number | null;
}

CaseModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    form_factor: {
      type: DataTypes.STRING,
      validate: { isIn: [CaseFormFactors] },
    },
    width: { type: DataTypes.FLOAT },
    length: { type: DataTypes.FLOAT },
    height: { type: DataTypes.FLOAT },

    io_ports: {
      type: DataTypes.VIRTUAL,
    },
    mb_support: {
      type: DataTypes.VIRTUAL,
    },

    expansion_slot: { type: DataTypes.INTEGER },
    max_cooler_height: { type: DataTypes.FLOAT },

    aio_support: {
      type: DataTypes.VIRTUAL,
    },
    fan_support: {
      type: DataTypes.VIRTUAL,
    },
    hard_drive_support: {
      type: DataTypes.VIRTUAL,
    },

    psu_support: { type: DataTypes.VIRTUAL },
    max_psu_length: { type: DataTypes.FLOAT },
  },
  {
    ...BaseModelOptions,
    defaultScope: PartDefaultScope,
    modelName: Tables.CASE,
  }
);

PartInformation.hasOne(CaseModel, {
  foreignKey: "id",
});
CaseModel.belongsTo(PartInformation, {
  foreignKey: "id",
});

export { CaseModel as Case };
