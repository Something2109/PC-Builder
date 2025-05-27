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
import GPUMemory from "@/utils/interface/part/info/GPUMemory";
import { InternalConnectors } from "@/utils/interface/utils";
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
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
  },
}))
@Table({ modelName: Infos.GPU_MEMORY })
class GPUMemoryModel extends Model implements PartDetailTable<GPUMemory.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.SGRAM.options] },
  })
  declare type: InternalConnectors.SGRAM | null;

  @Column(DataType.INTEGER)
  declare speed: number | null;

  @Column(DataType.FLOAT)
  declare capacity: number | null;

  @Column(DataType.FLOAT)
  declare bandwidth: number | null;

  @Column(DataType.INTEGER)
  declare bus_width: number | null;
}

export { GPUMemoryModel };
