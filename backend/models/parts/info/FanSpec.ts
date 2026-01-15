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
import * as FanSpec from "@/utils/part/info/FanSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import { Infos } from "@/utils/part";
import { PartInformation } from "..";
import { ModelScopes, PartDefaultScope, defaultFilter } from "../../interface";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Infos.FAN_SPEC })
class FanSpecModel extends Model implements FanSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Fan.options] },
  })
  declare form_factor: FormFactor.Fan | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.TINYINT)
  declare count: number | null;

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

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FanSpec.Bearing.options] },
  })
  declare bearing: FanSpec.Bearing | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Fan.Connector.options] },
  })
  declare connector: InternalConnectors.Fan.Connector | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RGB.options] },
  })
  declare rgb: InternalConnectors.RGB | null;
}

export { FanSpecModel };
