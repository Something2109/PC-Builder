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
import SSDSpec from "@/utils/interface/part/info/SSDSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { Infos } from "@/utils/Enum";
import { PartInformation } from "..";
import {
  PartDetailTable,
  PartDefaultScope,
  ModelScopes,
  defaultFilter,
} from "../../interface";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: (attributes?: string[]) => ({
    attributes: attributes?.length ? ["id", ...attributes] : [],
  }),
  [ModelScopes.FILTER]: (options?: Record<string, string[] | number[]>) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Infos.SSD_SPEC })
class SSDSpecModel extends Model implements PartDetailTable<SSDSpec.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [SSDSpec.MemoryCell.options] },
  })
  declare memory_type: SSDSpec.MemoryCell | null;

  @Column(DataType.INTEGER)
  declare capacity: number | null;

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

export { SSDSpecModel };
