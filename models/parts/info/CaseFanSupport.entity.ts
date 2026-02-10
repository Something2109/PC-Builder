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
import * as CaseFanSupport from "@/utils/part/info/CaseFanSupport";
import { Case, FormFactor } from "@/utils/interface";
import { Infos } from "@/utils/part";
import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

/**
 * Define the fan support model for the case model.
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
@Table({ modelName: Infos.CASE_FAN })
export default class CaseFanSupportModel extends Model implements CaseFanSupport.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({ type: DataType.STRING, validate: { isIn: [Case.Side.options] } })
  declare case_side: Case.Side;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Fan.options] },
  })
  declare form_factor: FormFactor.Fan;

  @Column(DataType.TINYINT)
  declare count: number | null;
}


