import {
  PartDetailTable,
  PartDefaultScope,
  Tables,
  ModelScopes,
} from "../../interface";
import { PartInformation } from "./Part";
import Mainboard from "@/utils/interface/part/Mainboard";
import {
  ExternalPorts,
  InternalConnectors,
  FormFactor,
} from "@/utils/interface/utils";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from "sequelize-typescript";
import {
  PowerConnectorExchanger,
  PCIeExchanger,
  USBExchanger,
} from "@/utils/extract/Connector";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: { attributes: ["id", ...Mainboard.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: Mainboard.FilterOptions) => ({
    where: options,
  }),
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: [
      {
        model: MainboardPCIeModel,
        attributes: ["controller", "version", "width", "count"],
      },
      { model: MainboardStorageConnectorModel, attributes: ["type", "count"] },
      {
        model: MainboardUSBConnectorModel,
        attributes: ["generation", "connector", "count"],
      },
    ],
  },
}))
@Table({ modelName: Tables.MAIN })
class MainboardModel extends Model implements PartDetailTable<Mainboard.Info> {
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
  declare ram_protocol: InternalConnectors.RAM | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;

  @Column(DataType.TINYINT)
  declare expansion_slots: number | null;

  /**
   * Declare the pcie object as a virtual column
   * extracting the {@link pcie_data} assossiated with
   * {@link MainboardPCIeModel} from the model
   * and converting it to a {@link Mainboard.PCIe} object.
   */

  @HasMany(() => MainboardPCIeModel)
  declare pcie_data: MainboardPCIeModel[];

  @Column(DataType.VIRTUAL)
  get pcies(): Mainboard.PCIe | null {
    const pcieData = this.getDataValue("pcie_data") as MainboardPCIeModel[];
    this.setDataValue("pcie_data", undefined);

    if (!pcieData) return null;

    return pcieData.reduce((acc: Mainboard.PCIe, pcie: MainboardPCIeModel) => {
      const controller = pcie.controller;
      if (!acc[controller]) acc[controller] = {};

      acc[controller][PCIeExchanger.toString(pcie)] = pcie.count;
      return acc;
    }, {});
  }

  /**
   * Declare the power connector object as a virtual column
   * extracting the data from the {@link main_power_connectors},
   * {@link cpu_power_connectors}, {@link pcie_power_connectors} columns
   * and converting it to a {@link Mainboard.PowerConnector} object.
   */

  @Column(DataType.VIRTUAL)
  get power_connectors(): Mainboard.PowerConnector | null {
    const main = this.getDataValue("main_power_connectors");
    const cpu = this.getDataValue("cpu_power_connectors");
    const pcie = this.getDataValue("pcie_power_connectors");

    return PowerConnectorExchanger.toObject({ main, cpu, pcie });
  }

  set power_connectors(value: Mainboard.PowerConnector | null) {
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
  get fan_connectors(): Record<string, number> | null {
    const data = this.getDataValue("fan_connectors");

    return data ? JSON.parse(data) : null;
  }

  set fan_connectors(value: Record<string, number> | null) {
    this.setDataValue("fan_connectors", value ? JSON.stringify(value) : null);
  }

  /**
   * Declare the storage connector object as a virtual column
   * extracting the {@link storage_connector_data} assossiated with
   * {@link MainboardStorageConnectorModel} from the model
   * and converting it to a {@link Mainboard.StorageConnector} object.
   */

  @HasMany(() => MainboardStorageConnectorModel)
  declare storage_connector_data: MainboardStorageConnectorModel[];

  @Column(DataType.VIRTUAL)
  get storage_connectors(): Mainboard.StorageConnector | null {
    const storageData = this.getDataValue(
      "storage_connector_data"
    ) as MainboardStorageConnectorModel[];
    this.setDataValue("storage_connector_data", undefined);

    if (!storageData) return null;

    return storageData.reduce(
      (
        acc: Mainboard.StorageConnector,
        storage: MainboardStorageConnectorModel
      ) => {
        acc[storage.type] = storage.count;
        return acc;
      },
      {}
    );
  }

  /**
   * Declare the usb connector object as a virtual column
   * extracting the {@link usb_data} assossiated with
   * {@link MainboardUSBConnectorModel} from the model
   * and converting it to a {@link Mainboard.USBConnector} object.
   */

  @HasMany(() => MainboardUSBConnectorModel)
  declare usb_data: MainboardUSBConnectorModel[];

  @Column(DataType.VIRTUAL)
  get usb_connectors(): Mainboard.USBConnector | null {
    const usbData = this.getDataValue(
      "usb_data"
    ) as MainboardUSBConnectorModel[];
    if (!usbData) return null;
    this.setDataValue("usb_data", undefined);

    return usbData.reduce(
      (acc: Mainboard.USBConnector, usb: MainboardUSBConnectorModel) => {
        const usbStr = USBExchanger.toString(usb);
        acc[usbStr] = usb.count;
        return acc;
      },
      {}
    );
  }

  /**
   * Declare the miscelanous connector object saving the data as a JSON string
   * in the {@link miscelanous_connectors} column.
   */

  @Column(DataType.TEXT)
  get miscelanous_connectors(): Record<string, number> | null {
    const data = this.getDataValue("miscelanous_connectors");

    return data ? JSON.parse(data) : null;
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
  get back_panel_ports(): {} | null {
    const data = this.getDataValue("back_panel_ports");

    return data ? JSON.parse(data) : null;
  }

  set back_panel_ports(value: {} | null) {
    this.setDataValue("back_panel_ports", value ? JSON.stringify(value) : null);
  }
}

/**
 * Declare the PCIe model to store the mainboard's PCIe data.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.MAIN_PCIe })
class MainboardPCIeModel extends Model {
  @PrimaryKey
  @ForeignKey(() => MainboardModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [InternalConnectors.PCIe.Controller.options] },
  })
  declare controller: InternalConnectors.PCIe.Controller;

  @PrimaryKey
  @Column(DataType.TINYINT)
  declare version: number;

  @PrimaryKey
  @Column(DataType.TINYINT)
  declare width: number;

  @Column(DataType.TINYINT)
  declare count: number;
}

/**
 * Declare the PCIe model to store the mainboard's PCIe data.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.MAIN_STORAGE })
class MainboardStorageConnectorModel extends Model {
  @PrimaryKey
  @ForeignKey(() => MainboardModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: {
      isIn: [
        [
          ...InternalConnectors.Storage.HDD.options,
          ...InternalConnectors.Storage.SSD.options,
        ],
      ],
    },
  })
  declare type: keyof Mainboard.StorageConnector;

  @Column(DataType.TINYINT)
  declare count: number;
}

/**
 * Declare the PCIe model to store the mainboard's PCIe data.
 * The model is used for future search and filter operations.
 */
@Table({ modelName: Tables.MAIN_USB })
class MainboardUSBConnectorModel extends Model {
  @PrimaryKey
  @ForeignKey(() => MainboardModel)
  @Column(DataType.UUID)
  declare id: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [ExternalPorts.USB.Generation.options] },
  })
  declare generation: ExternalPorts.USB.Generation;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [ExternalPorts.USB.Connector.options] },
  })
  declare connector: ExternalPorts.USB.Connector;

  @Column(DataType.TINYINT)
  declare count: number;
}

export {
  MainboardModel,
  MainboardPCIeModel,
  MainboardStorageConnectorModel,
  MainboardUSBConnectorModel,
};
