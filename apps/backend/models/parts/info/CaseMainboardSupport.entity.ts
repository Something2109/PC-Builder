import { FormFactor } from "@pc-builder/shared/interface";
import { Infos } from "@pc-builder/shared/part";
import * as CaseMainboardSupport from "@pc-builder/shared/part/info/CaseMainboardSupport";
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

/**
 * Define the mainboard support model for the case model.
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
  modelName: Infos.CASE_MAIN,
  indexes: [
    {
      name: "case_mb_form_idx",
      fields: ["form_factor"],
    },
  ],
})
export default class CaseMainboardSupportModel extends Model implements CaseMainboardSupport.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare case: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Mainboard.options] },
  })
  declare form_factor: FormFactor.Mainboard;
}
