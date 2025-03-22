import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import RAM from "@/utils/interface/info/RAM";
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
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options: RAM.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.RAM })
class RAMModel extends Model implements PartDetailTable<RAM.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare speed: number | null;

  @Column(DataType.INTEGER)
  declare capacity: number | null;

  @Column(DataType.FLOAT)
  declare voltage: number | null;

  @Column(DataType.STRING)
  get latency(): number[] | undefined {
    const data = this.getDataValue("latency");

    return data ? JSON.parse(data) : undefined;
  }

  set latency(value: number[] | null) {
    this.setDataValue("latency", value ? JSON.stringify(value) : null);
  }

  @Column(DataType.TINYINT)
  declare kit: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.RAM.options] },
  })
  declare form_factor: FormFactor.RAM | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RAM.options] },
  })
  declare interface: InternalConnectors.RAM | null;
}

export { RAMModel };
