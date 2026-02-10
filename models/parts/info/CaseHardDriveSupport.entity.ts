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
import * as CaseHardDriveSupport from "@/utils/part/info/CaseHardDriveSupport";
import { Case } from "@/utils/interface";
import { Infos } from "@/utils/part";
import { PartInformation } from "..";
import { PartDefaultScope, ModelScopes, defaultFilter } from "../../interface";

/**
 * Define the hard drive support model for the case model.
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
@Table({ modelName: Infos.CASE_HARD_DRIVE })
export default class CaseHardDriveSupportModel extends Model
  implements CaseHardDriveSupport.Model
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [["Drive Bay", ...Case.Side.options]] },
  })
  declare place: Case.HardDrivePlace;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [Case.HardDriveFormFactor.options] },
  })
  declare form_factor: Case.HardDriveFormFactor;

  @Column(DataType.TINYINT)
  declare count: number | null;
}



