import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  WhereOptions,
} from "sequelize";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import {
  CaseFormFactors,
  CaseFormFactorType,
  MainboardFormFactors,
  MainboardFormFactorType,
  PSUFormFactors,
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

  declare mb_support_str: string | null;
  declare aio_support_json: string | null;
  declare fan_support_json: string | null;
  declare hard_drive_support_json: string | null;
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
      get(): MainboardFormFactorType[] | null {
        const data = this.getDataValue("mb_support_str");
        if (data) {
          return data.split(",");
        }
        return null;
      },
      set(data: MainboardFormFactorType[] | null) {
        this.setDataValue("mb_support_str", data ? data.join(",") : null);
      },
    },
    expansion_slot: { type: DataTypes.INTEGER },

    max_cooler_height: { type: DataTypes.FLOAT },
    aio_support: {
      type: DataTypes.VIRTUAL,
      get(): Case.AIOSupport | null {
        const data = this.getDataValue("aio_support_json");
        if (data) {
          return JSON.parse(data) as Case.AIOSupport;
        }
        return null;
      },
      set(data: Case.AIOSupport | null) {
        this.setDataValue(
          "aio_support_json",
          data ? JSON.stringify(data) : null
        );
      },
    },
    fan_support: {
      type: DataTypes.VIRTUAL,
      get(): Case.FanSupport | null {
        const data = this.getDataValue("fan_support_json");
        if (data) {
          return JSON.parse(data) as Case.FanSupport;
        }
        return null;
      },
      set(data: Case.FanSupport | null) {
        this.setDataValue(
          "fan_support_json",
          data ? JSON.stringify(data) : null
        );
      },
    },
    hard_drive_support: {
      type: DataTypes.VIRTUAL,
      get(): Case.HardDriveSupport | null {
        const data = this.getDataValue("hard_drive_support_json");
        if (data) {
          return JSON.parse(data) as Case.HardDriveSupport;
        }
        return null;
      },
      set(data: Case.HardDriveSupport | null) {
        this.setDataValue(
          "hard_drive_support_json",
          data ? JSON.stringify(data) : null
        );
      },
    },

    psu_support: {
      type: DataTypes.STRING,
      validate: { isIn: [PSUFormFactors] },
    },
    max_psu_length: { type: DataTypes.FLOAT },

    mb_support_str: {
      type: DataTypes.STRING,
      validate: {
        is: new RegExp(`((^|,)(${MainboardFormFactors.join("|")}))+$`),
      },
    },
    aio_support_json: { type: DataTypes.TEXT },
    fan_support_json: { type: DataTypes.TEXT },
    hard_drive_support_json: { type: DataTypes.TEXT },
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

export { CaseModel };
