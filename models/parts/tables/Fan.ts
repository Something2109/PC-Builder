import {
  ModelScopes,
  PartDefaultScope,
  PartDetailTable,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import Fan from "@/utils/interface/part/Fan";
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
  [ModelScopes.SUMMARY]: { attributes: ["id", ...Fan.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: Fan.FilterOptions) => ({ where: options }),
  [ModelScopes.DETAIL]: PartDefaultScope,
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

  @Column({ type: DataType.STRING, validate: { isIn: [Fan.Bearing.options] } })
  declare bearing: Fan.Bearing | null;

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

export { FanModel };
