import {
  BaseModelOptions,
  PartDetailTable,
  PartDefaultScope,
  Tables,
} from "../../interface";
import { PartInformation } from "./Part";
import PSU from "@/utils/interface/part/PSU";
import {
  PSUEfficiencies,
  PSUEfficiencyType,
  PSUFormFactors,
  PSUFormFactorType,
  PSUModulars,
  PSUModularType,
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
  summary: { attributes: [...PSU.SummaryAttributes] },
  filter: (options: PSU.FilterOptions) => ({ where: options }),
  detail: { attributes: { exclude: ["id", "createdAt", "updatedAt"] } },
}))
@Table({ ...BaseModelOptions, modelName: Tables.PSU })
class PSUModel extends Model implements PartDetailTable<PSU.Info> {
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column(DataType.INTEGER)
  declare wattage: number | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [PSUEfficiencies.options] },
  })
  declare efficiency: PSUEfficiencyType | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [PSUFormFactors.options] },
  })
  declare form_factor: PSUFormFactorType | null;

  @Column(DataType.INTEGER)
  declare width: number | null;

  @Column(DataType.INTEGER)
  declare length: number | null;

  @Column(DataType.INTEGER)
  declare height: number | null;

  @Column({ type: DataType.STRING, validate: { isIn: [PSUModulars.options] } })
  declare modular: PSUModularType | null;

  @Column(DataType.TINYINT)
  declare atx_pin: number | null;

  @Column(DataType.TINYINT)
  declare cpu_pin: number | null;

  @Column(DataType.TINYINT)
  declare pcie_pin: number | null;

  @Column(DataType.TINYINT)
  declare sata_pin: number | null;

  @Column(DataType.TINYINT)
  declare peripheral_pin: number | null;
}

export { PSUModel };
