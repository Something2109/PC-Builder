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
import { PartDetailTable, PartDefaultScope, Tables } from "../../interface";
import { PartInformation } from "./Part";
import {
  FormFactor,
  CoolerCPUPlates,
  CoolerCPUPlateType,
} from "@/utils/interface/utils";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...AIO.SummaryAttributes] },
  filter: (options: AIO.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ modelName: Tables.AIO })
class AIOModel extends Model implements PartDetailTable<AIO.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.AIO.options] },
  })
  declare form_factor: FormFactor.AIO | null;

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
