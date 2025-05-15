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
import ProcessorMemory from "@/utils/interface/part/info/ProcessorMemorySpec";
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
@Table({ modelName: Infos.PROCESSOR_MEMORY })
class ProcessorMemoryModel
  extends Model
  implements PartDetailTable<ProcessorMemory.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RAM.options] },
  })
  declare type: InternalConnectors.RAM | null;

  @Column(DataType.FLOAT)
  declare capacity: number | null;

  @Column(DataType.TINYINT)
  declare channel_count: number | null;

  @Column(DataType.FLOAT)
  declare bandwidth: number | null;

  @Column(DataType.INTEGER)
  declare bus: number | null;
}

export { ProcessorMemoryModel };
