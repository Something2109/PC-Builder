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

import { Infos } from "@/utils/part";
import * as ProcessorCache from "@/utils/part/info/ProcessorCache";

import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

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
@Table({
  modelName: Infos.PROCESSOR_CACHE,
  indexes: [
    {
      name: "proc_cache_L3_idx",
      fields: ["L3_cache"],
    },
  ],
})
export default class ProcessorCacheModel extends Model implements ProcessorCache.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.FLOAT)
  declare L1_cache: number | null;

  @Column(DataType.FLOAT)
  declare L2_cache: number | null;

  @Column(DataType.FLOAT)
  declare L3_cache: number | null;
}
