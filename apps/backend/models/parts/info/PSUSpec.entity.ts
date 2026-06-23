import { FormFactor } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as PSUSpec from "@pc-builder/shared/part/info/PSUSpec";
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
  modelName: Infos.PSU_SPEC,
  indexes: [
    {
      name: "psu_spec_form_idx",
      fields: ["form_factor"],
    },
    {
      name: "psu_spec_wattage_idx",
      fields: ["wattage"],
    },
    {
      name: "psu_spec_eff_idx",
      fields: ["efficiency"],
    },
    {
      name: "psu_spec_modular_idx",
      fields: ["modular"],
    },
  ],
})
export default class PSUSpecModel extends Model implements PSUSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare wattage: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [PSUSpec.Efficiency.options] },
  })
  declare efficiency: PSUSpec.Efficiency | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.PSU.options] },
  })
  declare form_factor: FormFactor.PSU | null;

  @Column(DataType.INTEGER)
  declare width: number | null;

  @Column(DataType.INTEGER)
  declare length: number | null;

  @Column(DataType.INTEGER)
  declare height: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [PSUSpec.Modular.options] },
  })
  declare modular: PSUSpec.Modular | null;
}
