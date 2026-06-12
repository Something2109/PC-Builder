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
import * as CPUPerformance from "@/utils/part/info/CPUPerformance";

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
  modelName: Infos.CPU_PERF,
  indexes: [
    {
      name: "cpu_perf_tdp_idx",
      fields: ["tdp"],
    },
  ],
})
export default class CPUPerformanceModel extends Model implements CPUPerformance.Model {
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


