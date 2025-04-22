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
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";
import { InternalConnectors, FormFactor } from "@/utils/interface/utils";
import { PowerConnectorExchanger } from "@/utils/extract/Connector";
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
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
  },
}))
@Table({ modelName: Infos.MAIN_SPEC })
class MainboardSpecModel
  extends Model
  implements PartDetailTable<MainboardSpec.Info>
{
  @PrimaryKey
  @ForeignKey(() => PartInformation)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => PartInformation)
  declare part: PartInformation;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.Mainboard.options] },
  })
  declare form_factor: FormFactor.Mainboard | null;

  @Column(DataType.STRING)
  declare socket: string | null;

  @Column(DataType.STRING)
  declare chipset: string | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [FormFactor.RAM.options] },
  })
  declare ram_form_factor: FormFactor.RAM | null;

  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.RAM.options] },
  })
  declare ram_interface: InternalConnectors.RAM | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;

  /**
   * Declare the power connector object as a virtual column
   * extracting the data from the {@link main_power_connectors},
   * {@link cpu_power_connectors}, {@link pcie_power_connectors} columns
   * and converting it to a {@link Mainboard.PowerConnector} object.
   */

  @Column(DataType.VIRTUAL)
  get power_connectors(): MainboardSpec.PowerConnector | undefined {
    const main = this.getDataValue("main_power_connectors");
    const cpu = this.getDataValue("cpu_power_connectors");
    const pcie = this.getDataValue("pcie_power_connectors");

    return PowerConnectorExchanger.toObject({ main, cpu, pcie }) ?? undefined;
  }

  set power_connectors(value: MainboardSpec.PowerConnector | null) {
    const { main, cpu, pcie } = PowerConnectorExchanger.toNumber(value);

    this.setDataValue("main_power_connectors", main);
    this.setDataValue("cpu_power_connectors", cpu);
    this.setDataValue("pcie_power_connectors", pcie);
  }

  @Column({ type: DataType.TINYINT, get: () => undefined })
  declare main_power_connectors: number | null;

  @Column({ type: DataType.TINYINT, get: () => undefined })
  declare cpu_power_connectors: number | null;

  @Column({ type: DataType.TINYINT, get: () => undefined })
  declare pcie_power_connectors: number | null;

  /**
   * Declare the fan connector object saving the data as a JSON string
   * in the {@link fan_connectors} column.
   */

  @Column(DataType.TEXT)
  get fan_connectors(): Record<string, number> | undefined {
    const data = this.getDataValue("fan_connectors");

    return data ? JSON.parse(data) : undefined;
  }

  set fan_connectors(value: Record<string, number> | null) {
    this.setDataValue("fan_connectors", value ? JSON.stringify(value) : null);
  }

  /**
   * Declare the miscelanous connector object saving the data as a JSON string
   * in the {@link miscelanous_connectors} column.
   */

  @Column(DataType.TEXT)
  get miscelanous_connectors(): Record<string, number> | undefined {
    const data = this.getDataValue("miscelanous_connectors");

    return data ? JSON.parse(data) : undefined;
  }

  set miscelanous_connectors(value: Record<string, number> | null) {
    this.setDataValue(
      "miscelanous_connectors",
      value ? JSON.stringify(value) : null
    );
  }

  /**
   * Declare the io port object saving the data as a JSON string
   * in the {@link io_ports} column.
   */

  @Column(DataType.TEXT)
  get back_panel_ports(): {} | undefined {
    const data = this.getDataValue("back_panel_ports");

    return data ? JSON.parse(data) : undefined;
  }

  set back_panel_ports(value: {} | null) {
    this.setDataValue("back_panel_ports", value ? JSON.stringify(value) : null);
  }
}

export { MainboardSpecModel };
