import { InternalConnectors } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as CPUMemory from "@pc-builder/shared/part/info/CPUMemory";
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
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
  },
}))
@Table({ modelName: Infos.CPU_MEMORY })
export default class CPUMemoryModel extends Model implements CPUMemory.Model {
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
  declare type: InternalConnectors.RAM;

  @Column(DataType.INTEGER)
  declare speed: number | null;

  @Column(DataType.FLOAT)
  declare capacity: number | null;

  @Column(DataType.TINYINT)
  declare channel_count: number | null;

  @Column(DataType.FLOAT)
  declare bandwidth: number | null;
}
