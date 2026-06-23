import { Infos } from "@pc-builder/shared/part";
import * as GPUPerformance from "@pc-builder/shared/part/info/GPUPerformance";
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
@Table({
  modelName: Infos.GPU_PERF,
  indexes: [
    {
      name: "gpu_perf_tdp_idx",
      fields: ["tdp"],
    },
  ],
})
export default class GPUPerformanceModel extends Model implements GPUPerformance.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare boost_frequency: number | null;

  @Column(DataType.INTEGER)
  declare tdp: number | null;
}
