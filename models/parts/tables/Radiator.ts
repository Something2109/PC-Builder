import {
  ModelScopes,
  PartDefaultScope,
  PartDetailTable,
  Tables,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import Radiator from "@/utils/interface/info/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
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

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (options: Radiator.FilterOptions) => ({
    attributes: ["id", ...Radiator.SummaryAttributes],
    where: defaultFilter(options),
  }),
  [ModelScopes.FILTER]: (options: Radiator.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.RADIATOR })
class RadiatorModel extends Model implements PartDetailTable<Radiator.Info> {
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

export { RadiatorModel };
