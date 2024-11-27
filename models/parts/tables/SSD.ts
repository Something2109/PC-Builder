import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import SSD from "@/utils/interface/part/SSD";
import {
  SSDFormFactors,
  SSDFormFactorType,
  SSDInterfaces,
  SSDInterfaceType,
  SSDMemoryCells,
  SSDMemoryCellType,
} from "@/utils/interface/utils";
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...SSD.SummaryAttributes] },
  filter: (options: SSD.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.SSD })
class SSDModel extends Model implements PartDetailTable<SSD.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [SSDMemoryCells.options] },
  })
  declare memory_type: SSDMemoryCellType | null;

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
    validate: { isIn: [SSDFormFactors.options] },
  })
  declare form_factor: SSDFormFactorType | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [SSDInterfaces.options] },
  })
  declare interface: SSDInterfaceType | null;
}

export { SSDModel };
