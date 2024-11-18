import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import HDD from "@/utils/interface/part/HDD";
import {
  HDDFormFactors,
  HDDFormFactorType,
  HDDProtocols,
  HDDProtocolType,
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
  summary: { attributes: [...HDD.SummaryAttributes] },
  filter: (options: HDD.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.HDD })
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

  @Column({ type: DataType.STRING, validate: { isIn: [HDDFormFactors] } })
  declare form_factor: HDDFormFactorType | null;

  @Column({ type: DataType.STRING, validate: { isIn: [HDDProtocols] } })
  declare protocol: HDDProtocolType | null;

  @Column({ type: DataType.TINYINT })
  declare protocol_version: number | null;
}

export { HDDModel };
