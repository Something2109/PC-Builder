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
import * as RAMSpec from "@/utils/part/info/RAMSpec";
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
@Table({ modelName: Infos.RAM_SPEC })
class RAMSpecModel extends Model implements RAMSpec.Model {
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
  get latency(): number[] | null {
    const data = this.getDataValue("latency");

    return data ? JSON.parse(data) : null;
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

export { RAMSpecModel };
