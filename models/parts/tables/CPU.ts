import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "..";
import CPU from "@/utils/interface/part/info/CPU";
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
  [ModelScopes.FILTER]: (options?: CPU.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.CPU })
class CPUModel extends Model implements PartDetailTable<CPU.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare family: string | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.TINYINT)
  declare total_cores: number | null;

  @Column(DataType.TINYINT)
  declare total_threads: number | null;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare turbo_frequency: number | null;

  @Column(DataType.TEXT)
  get cores(): CPU.Core | undefined {
    const data = this.getDataValue("cores");

    return data ? JSON.parse(data) : undefined;
  }

  set cores(value: CPU.Core | null) {
    this.setDataValue("cores", value ? JSON.stringify(value) : null);
  }

  @Column(DataType.FLOAT)
  declare L2_cache: number | null;

  @Column(DataType.FLOAT)
  declare L3_cache: number | null;

  @Column(DataType.FLOAT)
  declare max_memory: number | null;

  @Column(DataType.INTEGER)
  declare max_memory_channel: number | null;

  @Column(DataType.FLOAT)
  declare max_memory_bandwidth: number | null;

  @Column(DataType.INTEGER)
  declare tdp: number | null;

  @Column(DataType.STRING)
  declare lithography: string | null;
}

export { CPUModel };
