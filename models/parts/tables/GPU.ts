import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import GPU from "@/utils/interface/part/GPU";
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
  [ModelScopes.SUMMARY]: (options: GPU.FilterOptions) => ({
    attributes: ["id", ...GPU.SummaryAttributes],
    where: options,
  }),
  [ModelScopes.FILTER]: (options?: GPU.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({
  modelName: Tables.GPU,
  validate: {
    coreValidate() {
      if (!this.core_count && !this.execution_unit) {
        throw new Error("Not enough core information provided");
      }
      if (!this.base_frequency && !this.boost_frequency) {
        throw new Error("Not enough frequency information provided");
      }
    },
  },
})
class GPUModel extends Model implements PartDetailTable<GPU.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.STRING)
  declare family: string | null;

  @Column(DataType.INTEGER)
  declare core_count: number | null;

  @Column(DataType.INTEGER)
  declare execution_unit: number | null;

  @Column(DataType.FLOAT)
  declare base_frequency: number | null;

  @Column(DataType.FLOAT)
  declare boost_frequency: number | null;

  @Column(DataType.STRING)
  get extra_cores(): GPU.Core | undefined {
    const data = this.getDataValue("extra_cores");

    return data ? JSON.parse(data) : undefined;
  }

  set extra_cores(value: GPU.Core | null) {
    this.setDataValue("extra_cores", value ? JSON.stringify(value) : null);
  }

  @Column(DataType.FLOAT)
  declare memory_size: number | null;

  @Column(DataType.STRING)
  declare memory_type: string | null;

  @Column(DataType.INTEGER)
  declare memory_bus: number | null;

  @Column(DataType.INTEGER)
  declare tdp: number | null;

  @Column(DataType.TEXT)
  get features(): GPU.Features | undefined {
    const data = this.getDataValue("features");

    return data ? JSON.parse(data) : undefined;
  }

  set features(value: GPU.Features | null) {
    this.setDataValue("features", value ? JSON.stringify(value) : null);
  }
}

export { GPUModel };
