import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import SSD from "@/utils/interface/info/SSD";
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
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options: SSD.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.SSD })
class SSDModel extends Model implements PartDetailTable<SSD.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [SSD.MemoryCell.options] },
  })
  declare memory_type: SSD.MemoryCell | null;

  @Column(DataType.INTEGER)
  declare read_speed: number | null;

  @Column(DataType.INTEGER)
  declare write_speed: number | null;

  @Column(DataType.INTEGER)
  declare capacity: number | null;

  @Column(DataType.INTEGER)
  declare cache: number | null;

  @Column(DataType.INTEGER)
  declare tbw: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.SSD.options] },
  })
  declare form_factor: FormFactor.SSD | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.Storage.SSD.options] },
  })
  declare interface: InternalConnectors.Storage.SSD | null;
}

export { SSDModel };
