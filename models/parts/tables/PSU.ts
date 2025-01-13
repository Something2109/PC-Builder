import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
  defaultFilter,
} from "../../interface";
import { PartInformation } from "./Part";
import PSU from "@/utils/interface/part/PSU";
import { FormFactor } from "@/utils/interface/utils";
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
  [ModelScopes.SUMMARY]: (options: PSU.FilterOptions) => ({
    attributes: ["id", ...PSU.SummaryAttributes],
    where: options,
  }),
  [ModelScopes.FILTER]: (options: PSU.FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [ModelScopes.DETAIL]: PartDefaultScope,
}))
@Table({ modelName: Tables.PSU })
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
    validate: { isIn: [PSU.Efficiency.options] },
  })
  declare efficiency: PSU.Efficiency | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.PSU.options] },
  })
  declare form_factor: FormFactor.PSU | null;

  @Column(DataType.INTEGER)
  declare width: number | null;

  @Column(DataType.INTEGER)
  declare length: number | null;

  @Column(DataType.INTEGER)
  declare height: number | null;

  @Column({ type: DataType.STRING, validate: { isIn: [PSU.Modular.options] } })
  declare modular: PSU.Modular | null;

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
