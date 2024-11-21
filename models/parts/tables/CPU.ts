import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import CPU from "@/utils/interface/part/CPU";
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
  summary: { attributes: [...CPU.SummaryAttributes] },
  filter: (options: CPU.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({
  ...BaseModelOptions,
  modelName: Tables.CPU,
  validate: {
    coresValidate() {
      if (
        this.base_frequency &&
        this.turbo_frequency &&
        this.base_frequency > this.turbo_frequency
      ) {
        throw new Error("Base frequency cannot be larger than the turbo");
      }
    },
  },
})
class CPUModel extends Model implements PartDetailTable<CPU.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare family: string | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.TINYINT)
  declare total_cores: number | null;

  @Column(DataType.TINYINT)
  declare total_threads: number | null;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare turbo_frequency: number | null;

  @Column(DataType.TEXT)
  get cores(): CPU.Core | null {
    const json = this.getDataValue("cores");
    if (json) {
      return JSON.parse(json) as CPU.Core;
    }
    return null;
  }

  set cores(value: CPU.Core | null) {
    this.setDataValue("cores", value ? JSON.stringify(value) : null);
  }

  @Column(DataType.FLOAT)
  declare L2_cache: number | null;

  @Column(DataType.FLOAT)
  declare L3_cache: number | null;

  @Column(DataType.FLOAT)
  declare max_memory: number | null;

  @Column(DataType.INTEGER)
  declare max_memory_channel: number | null;

  @Column(DataType.FLOAT)
  declare max_memory_bandwidth: number | null;

  @Column(DataType.INTEGER)
  declare tdp: number | null;

  @Column(DataType.STRING)
  declare lithography: string | null;
}

export { CPUModel };
