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
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import {
  PartDetailTable,
  PartDefaultScope,
  ModelScopes,
  defaultFilter,
} from "../../interface";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Infos.CPU_PERF })
class CPUPerformanceModel
  extends Model
  implements PartDetailTable<CPUPerformance.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare turbo_frequency: number | null;

  @Column(DataType.INTEGER)
  declare tdp: number | null;
}

export { CPUPerformanceModel };
