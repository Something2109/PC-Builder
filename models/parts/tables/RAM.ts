import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import RAM from "@/utils/interface/part/RAM";
import {
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
  summary: { attributes: [...RAM.SummaryAttributes] },
  filter: (options: RAM.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.RAM })
class RAMModel extends Model implements PartDetailTable<RAM.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare speed: number | null;

  @Column(DataType.INTEGER)
  declare capacity: number | null;

  @Column(DataType.FLOAT)
  declare voltage: number | null;

  @Column(DataType.STRING)
  get latency(): number[] | null {
    const data = this.getDataValue("latency_json");
    if (data) {
      return JSON.parse(data) as number[];
    }
    return null;
  }

  set latency(value: number[] | null) {
    this.setDataValue("latency_json", value ? JSON.stringify(value) : null);
  }

  @Column(DataType.TINYINT)
  declare kit: number | null;

  @Column({ type: DataType.STRING, validate: { isIn: [RAMFormFactors] } })
  declare form_factor: RAMFormFactorType | null;

  @Column({ type: DataType.STRING, validate: { isIn: [RAMProtocols] } })
  declare protocol: RAMProtocolType | null;
}

export { RAMModel };
