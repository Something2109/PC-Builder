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
import * as PSUSpec from "@/utils/part/info/PSUSpec";
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
@Table({ modelName: Infos.PSU_SPEC })
class PSUSpecModel extends Model implements PSUSpec.Model {
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

export { PSUSpecModel };
