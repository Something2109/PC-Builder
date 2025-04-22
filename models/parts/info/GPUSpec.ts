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
import GPUSpec from "@/utils/interface/part/info/GPUSpec";
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
@Table({ modelName: Infos.GPU_SPEC })
class GPUSpecModel extends Model implements PartDetailTable<GPUSpec.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare family: string | null;

  @Column(DataType.INTEGER)
  declare core_count: number | null;

  @Column(DataType.INTEGER)
  declare rops: number | null;

  @Column(DataType.INTEGER)
  declare tmus: number | null;

  @Column(DataType.INTEGER)
  declare execution_unit: number | null;

  @Column(DataType.INTEGER)
  declare ray_tracing: number | null;

  @Column(DataType.INTEGER)
  declare tensor: number | null;
}

export { GPUSpecModel };
