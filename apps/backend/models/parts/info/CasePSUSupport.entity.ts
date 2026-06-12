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

import { FormFactor } from "@/utils/interface";
import { Infos } from "@/utils/part";
import * as CasePSUSupport from "@/utils/part/info/CasePSUSupport";

import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

/**
 * Define the psu support model for the case model.
 * The model is used for future search and filter operations.
 */
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
  modelName: Infos.CASE_PSU,
  indexes: [
    {
      name: "case_psu_form_idx",
      fields: ["psu_support"],
    },
  ],
})
export default class CasePSUSupportModel extends Model implements CasePSUSupport.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare case: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.PSU.options] },
  })
  declare psu_support: FormFactor.PSU;
}


