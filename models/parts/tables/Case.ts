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
} from "@/utils/interface/utils";
import Case from "@/utils/interface/part/Case";
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import { Op, WhereOptions } from "sequelize";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...Case.SummaryAttributes] },
  filter: ({ mb_support, ...rest }: Case.FilterOptions) => {
    const filter: WhereOptions = {
      ...rest,
    };
    if (mb_support) {
      filter.mb_support = {
        [Op.regexp]: new RegExp(mb_support?.join("|")),
      };
    }

    return { where: filter };
  },
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.CASE })
class CaseModel extends Model implements PartDetailTable<Case.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({ type: DataType.STRING, validate: { isIn: [CaseFormFactors] } })
  declare form_factor: CaseFormFactorType | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  declare io_ports: {} | null;

  @Column({ type: DataType.STRING, validate: { isIn: [MainboardFormFactors] } })
  declare mb_support: MainboardFormFactorType | null;

  @Column(DataType.INTEGER)
  declare expansion_slot: number | null;

  @Column(DataType.FLOAT)
  declare max_cooler_height: number | null;

  @Column(DataType.TEXT)
  get aio_support(): Case.AIOSupport | null {
    const data = this.getDataValue("aio_support_json");
    if (data) {
      return JSON.parse(data) as Case.AIOSupport;
    }
    return null;
  }

  set aio_support(data: Case.AIOSupport | null) {
    this.setDataValue("aio_support_json", data ? JSON.stringify(data) : null);
  }

  @Column(DataType.TEXT)
  get fan_support(): Case.FanSupport | null {
    const data = this.getDataValue("fan_support_json");
    if (data) {
      return JSON.parse(data) as Case.FanSupport;
    }
    return null;
  }

  set fan_support(data: Case.FanSupport | null) {
    this.setDataValue("fan_support_json", data ? JSON.stringify(data) : null);
  }

  @Column(DataType.TEXT)
  get hard_drive_support(): Case.HardDriveSupport | null {
    const data = this.getDataValue("hard_drive_support_json");
    if (data) {
      return JSON.parse(data) as Case.HardDriveSupport;
    }
    return null;
  }

  set hard_drive_support(data: Case.HardDriveSupport | null) {
    this.setDataValue(
      "hard_drive_support_json",
      data ? JSON.stringify(data) : null
    );
  }

  @Column({ type: DataType.STRING, validate: { isIn: [PSUFormFactors] } })
  declare psu_support: PSUFormFactorType | null;

  @Column(DataType.FLOAT)
  declare max_psu_length: number | null;
}

export { CaseModel };
