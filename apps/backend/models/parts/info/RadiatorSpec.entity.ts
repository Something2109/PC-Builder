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

import { FormFactor, Material } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as RadiatorSpec from "@pc-builder/shared/part/info/RadiatorSpec";

import { PartInformation } from "..";
import { ModelScopes, PartDefaultScope, defaultFilter } from "../../interface";

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
  modelName: Infos.RADIATOR_SPEC,
  indexes: [
    {
      name: "rad_spec_form_idx",
      fields: ["form_factor"],
    },
  ],
})
export default class RadiatorSpecModel extends Model implements RadiatorSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Radiator.options] },
  })
  declare form_factor: FormFactor.Radiator | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.TINYINT)
  declare fpi: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [Material.Metal.options] },
  })
  declare material: Material.Metal | null;
}
