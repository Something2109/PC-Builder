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
import AIO from "@/utils/interface/part/AIO";
import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import {
  AIOFormFactors,
  AIOFormFactorType,
  CoolerCPUPlates,
  CoolerCPUPlateType,
} from "@/utils/interface/utils";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...AIO.SummaryAttributes] },
  filter: (options: AIO.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.AIO })
class AIOModel extends Model implements PartDetailTable<AIO.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [AIOFormFactors.options] },
  })
  declare form_factor: AIOFormFactorType | null;

  @Column(DataType.FLOAT)
  declare radiator_width: number | null;

  @Column(DataType.FLOAT)
  declare radiator_length: number | null;

  @Column(DataType.FLOAT)
  declare radiator_height: number | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [CoolerCPUPlates.options] },
  })
  declare cpu_plate: CoolerCPUPlateType | null;

  @Column(DataType.FLOAT)
  declare pump_width: number | null;

  @Column(DataType.FLOAT)
  declare pump_length: number | null;

  @Column(DataType.FLOAT)
  declare pump_height: number | null;

  @Column(DataType.FLOAT)
  declare pump_speed: number | null;
}

export { AIOModel };
