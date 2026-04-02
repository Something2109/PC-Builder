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
import * as PumpSpec from "@/utils/part/info/PumpSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import { Infos } from "@/utils/part";
import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Infos.PUMP_SPEC })
class PumpSpecModel extends Model implements PumpSpec.Model {
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

export { PumpSpecModel };
