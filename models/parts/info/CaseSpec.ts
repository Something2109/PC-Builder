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
import * as CaseSpec from "@/utils/part/info/CaseSpec";
import { FormFactor } from "@/utils/interface";
import { Infos } from "@/utils/part";
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
@Table({ modelName: Infos.CASE_SPEC })
class CaseSpecModel extends Model implements CaseSpec.Model {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Case.options] },
  })
  declare form_factor: FormFactor.Case | null;

  @Column(DataType.FLOAT)
  declare width: number | null;

  @Column(DataType.FLOAT)
  declare length: number | null;

  @Column(DataType.FLOAT)
  declare height: number | null;

  @Column(DataType.INTEGER)
  declare expansion_slot: number | null;

  @Column(DataType.FLOAT)
  declare max_cooler_height: number | null;

  @Column(DataType.FLOAT)
  declare max_psu_length: number | null;
}

export { CaseSpecModel };
