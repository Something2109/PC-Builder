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
import CPUCoreConfig from "@/utils/interface/part/info/CPUCoreConfig";
import { Infos } from "@/utils/Enum";
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
@Table({ modelName: Infos.CPU_CORES })
class CPUCoreConfigModel extends Model implements CPUCoreConfig.Info {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.TINYINT)
  declare count: number;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare turbo_frequency: number | null;
}

export { CPUCoreConfigModel };
