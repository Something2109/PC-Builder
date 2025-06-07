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
import CaseRadiatorSupport from "@/utils/interface/part/info/CaseRadiatorSupport";
import { Case, FormFactor } from "@/utils/interface/utils";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

/**
 * Define the radiator support model for the case model.
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
@Table({ modelName: Infos.CASE_RADIATOR })
class CaseRadiatorSupportModel
  extends Model
  implements CaseRadiatorSupport.Model
{
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
  @Column(DataType.STRING)
  declare form_factor: FormFactor.Radiator;
}

export { CaseRadiatorSupportModel };
