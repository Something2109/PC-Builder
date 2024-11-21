import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import Mainboard from "@/utils/interface/part/Mainboard";
import {
  MainboardFormFactors,
  MainboardFormFactorType,
  RAMFormFactors,
  RAMFormFactorType,
  RAMProtocols,
  RAMProtocolType,
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
  summary: { attributes: [...Mainboard.SummaryAttributes] },
  filter: (options: Mainboard.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.MAIN })
class MainboardModel extends Model implements PartDetailTable<Mainboard.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [MainboardFormFactors.options] },
  })
  declare form_factor: MainboardFormFactorType | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [RAMFormFactors.options] },
  })
  declare ram_form_factor: RAMFormFactorType | null;

  @Column({ type: DataType.STRING, validate: { isIn: [RAMProtocols.options] } })
  declare ram_protocol: RAMProtocolType | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;

  @Column(DataType.TINYINT)
  declare expansion_slots: number | null;

  @Column(DataType.STRING)
  declare io_ports: {} | null;
}

export { MainboardModel };
