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

import { InternalConnectors, Material } from "@/utils/interface";
import { Infos } from "@/utils/part";
import * as CPUBlockSpec from "@/utils/part/info/CPUBlockSpec";

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
  modelName: Infos.CPU_BLOCK_SPEC,
  indexes: [
    {
      name: "cpu_block_spec_plate_idx",
      fields: ["plate"],
    },
  ],
})
export default class CPUBlockSpecModel extends Model implements CPUBlockSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [Material.Metal.options] },
  })
  declare plate: Material.Metal | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RGB.options] },
  })
  declare rgb: InternalConnectors.RGB | null;
}
