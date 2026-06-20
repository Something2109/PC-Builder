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

import { Infos } from "@pc-builder/shared/part";
import * as CPUSpec from "@pc-builder/shared/part/info/CPUSpec";

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
  modelName: Infos.CPU_SPEC,
  indexes: [
    {
      name: "cpu_spec_socket_idx",
      fields: ["socket"],
    },
    {
      name: "cpu_spec_cores_idx",
      fields: ["total_cores"],
    },
  ],
})
export default class CPUSpecModel extends Model implements CPUSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare family: string | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.INTEGER)
  declare total_cores: number | null;

  @Column(DataType.INTEGER)
  declare total_threads: number | null;

  @Column(DataType.STRING)
  declare lithography: string | null;
}
