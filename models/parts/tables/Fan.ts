import { PartDefaultScope, PartDetailTable, Tables } from "../../interface";
import { PartInformation } from "./Part";
import Fan from "@/utils/interface/part/Fan";
import {
  FanBearings,
  FanBearingType,
  FanFormFactors,
  FanFormFactorType,
} from "@/utils/interface/utils";
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

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...Fan.SummaryAttributes] },
  filter: (options: Fan.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ modelName: Tables.FAN })
class FanModel extends Model implements PartDetailTable<Fan.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FanFormFactors.options] },
  })
  declare form_factor: FanFormFactorType | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.FLOAT)
  declare voltage: number | null;

  @Column(DataType.INTEGER)
  declare speed: number | null;

  @Column(DataType.FLOAT)
  declare airflow: number | null;

  @Column(DataType.FLOAT)
  declare noise: number | null;

  @Column(DataType.FLOAT)
  declare static_pressure: number | null;

  @Column({ type: DataType.STRING, validate: { isIn: [FanBearings.options] } })
  declare bearing: FanBearingType | null;
}

export { FanModel };
