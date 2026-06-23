import { Infos } from "@pc-builder/shared/part";
import * as GPUSpec from "@pc-builder/shared/part/info/GPUSpec";
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
  modelName: Infos.GPU_SPEC,
  indexes: [
    {
      name: "gpu_spec_cores_idx",
      fields: ["core_count"],
    },
  ],
})
export default class GPUSpecModel extends Model implements GPUSpec.Model {
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
