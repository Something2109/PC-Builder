import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import HDD from "@/utils/interface/part/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
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
  [ModelScopes.SUMMARY]: { attributes: ["id", ...HDD.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: HDD.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.HDD })
class HDDModel extends Model implements PartDetailTable<HDD.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare rotational_speed: number | null;

  @Column(DataType.INTEGER)
  declare read_speed: number | null;

  @Column(DataType.INTEGER)
  declare write_speed: number | null;

  @Column(DataType.TINYINT)
  declare capacity: number | null;

  @Column(DataType.INTEGER)
  declare cache: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.HDD.options] },
  })
  declare form_factor: FormFactor.HDD | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Storage.HDD.options] },
  })
  declare interface: InternalConnectors.Storage.HDD | null;
}

export { HDDModel };
