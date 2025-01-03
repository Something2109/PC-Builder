import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import AIO from "@/utils/interface/part/AIO";
import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
} from "../../interface";
import { PartInformation } from "./Part";
import { FormFactor } from "@/utils/interface/utils";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: { attributes: ["id", ...AIO.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: AIO.FilterOptions) => ({ where: options }),
  [ModelScopes.DETAIL]: PartDefaultScope,
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
    validate: { isIn: [FormFactor.Radiator.options] },
  })
  declare form_factor: FormFactor.Radiator | null;

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
    validate: { isIn: [AIO.CPUPlate.options] },
  })
  declare cpu_plate: AIO.CPUPlate | null;

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
