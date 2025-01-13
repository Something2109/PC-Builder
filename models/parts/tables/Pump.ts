import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import Pump from "@/utils/interface/part/Pump";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
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

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (options: Pump.FilterOptions) => ({
    attributes: ["id", ...Pump.SummaryAttributes],
    where: options,
  }),
  [ModelScopes.FILTER]: (options: Pump.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.PUMP })
class PumpModel extends Model implements PartDetailTable<Pump.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Pump.options] },
  })
  declare form_factor: FormFactor.Pump;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.FLOAT)
  declare voltage: number | null;

  @Column(DataType.TINYINT)
  declare wattage: number | null;

  @Column(DataType.FLOAT)
  declare head_pressure: number | null;

  @Column(DataType.INTEGER)
  declare flow_rate: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Power.Miscellanous.options] },
  })
  declare power_connector: InternalConnectors.Power.Miscellanous | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Fan.Connector.options] },
  })
  declare control_connector: InternalConnectors.Fan.Connector | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RGB.options] },
  })
  declare rgb: InternalConnectors.RGB | null;
}

export { PumpModel };
