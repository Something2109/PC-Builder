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
import GPUFeature from "@/utils/interface/part/info/GPUFeature";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import {
  ModelScopes,
  PartDefaultScope,
  PartDetailTable,
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
@Table({ modelName: Infos.GPU_FEAT })
class GPUFeatureModel
  extends Model
  implements PartDetailTable<GPUFeature.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare DirectX: string | null;

  @Column(DataType.STRING)
  declare OpenGL: string | null;

  @Column(DataType.STRING)
  declare OpenCL: string | null;

  @Column(DataType.STRING)
  declare Vulkan: string | null;

  @Column(DataType.STRING)
  declare CUDA: string | null;
}

export { GPUFeatureModel };
