import { PartDetailTable, PartDefaultScope, Tables } from "../../interface";
import { PartInformation } from "./Part";
import Mainboard from "@/utils/interface/part/Mainboard";
import {
  ExternalPorts,
  HDDInterfaces,
  InternalConnectors,
  FormFactor,
  RAMProtocols,
  RAMProtocolType,
  SSDInterfaces,
} from "@/utils/interface/utils";
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
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

@DefaultScope(() => PartDefaultScope)
@Scopes(() => ({
  summary: { attributes: [...Mainboard.SummaryAttributes] },
  filter: (options: Mainboard.FilterOptions) => ({ where: options }),
  detail: {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: MainboardPCIeModel,
        attributes: ["controller", "version", "width", "count"],
      },
      {
        model: MainboardStorageConnectorModel,
        attributes: ["type", "count"],
      },
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

  @Column({ type: DataType.STRING, validate: { isIn: [RAMProtocols.options] } })
  declare ram_protocol: RAMProtocolType | null;

  @Column(DataType.TINYINT)
  declare ram_slot: number | null;

  @Column(DataType.TINYINT)
  declare expansion_slots: number | null;

  /**
   * Declare the pcie object as a virtual column
   * extracting the {@link pcie_data} assossiated with
   * {@link MainboardPCIeModel} from the model
   * and converting it to a {@link Mainboard.PCIeType} object.
   */

  @HasMany(() => MainboardPCIeModel)
  declare pcie_data: MainboardPCIeModel[];

  @Column(DataType.VIRTUAL)
  get pcies(): Mainboard.PCIeType | null {
    const pcieData = this.getDataValue("pcie_data") as MainboardPCIeModel[];

    if (!pcieData) return null;

    return pcieData.reduce(
      (acc: Mainboard.PCIeType, pcie: MainboardPCIeModel) => {
        const controller = pcie.controller;
        if (!acc[controller]) acc[controller] = {};

        acc[controller][PCIeExchanger.toString(pcie)] = pcie.count;
        return acc;
      },
      {}
    );
  }

  set pcies(value: Mainboard.PCIeType | null) {
    if (!value) return;

    for (const [controller, pcie] of Object.entries(value)) {
      for (const [type, count] of Object.entries(pcie)) {
        const { width, version } = PCIeExchanger.toObject(type);

        MainboardPCIeModel.findOrCreate({
          where: {
            id: this.id,
            controller,
            version: Number(version),
            width: Number(width),
          },
          defaults: { count },
        }).then(([value, created]) => {
          if (!created) value.update({ count });
        });
      }
    }
  }

  /**
   * Declare the power connector object as a virtual column
   * extracting the data from the {@link main_power_connectors},
   * {@link cpu_power_connectors}, {@link pcie_power_connectors} columns
   * and converting it to a {@link Mainboard.PowerConnectorType} object.
   */

  @Column(DataType.VIRTUAL)
  get power_connectors(): Mainboard.PowerConnectorType | null {
    const main = this.getDataValue("main_power_connectors");
    const cpu = this.getDataValue("cpu_power_connectors");
    const pcie = this.getDataValue("pcie_power_connectors");

    return PowerConnectorExchanger.toObject({ main, cpu, pcie });
  }

  set power_connectors(value: Mainboard.PowerConnectorType | null) {
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
   * and converting it to a {@link Mainboard.StorageConnectorType} object.
   */

  @HasMany(() => MainboardStorageConnectorModel)
  declare storage_connector_data: MainboardStorageConnectorModel[] | null;

  @Column(DataType.VIRTUAL)
  get storage_connectors(): Mainboard.StorageConnectorType | null {
    const storageData = this.getDataValue(
      "storage_connector_data"
    ) as MainboardStorageConnectorModel[];

    if (!storageData) return null;

    return storageData.reduce(
      (
        acc: Mainboard.StorageConnectorType,
        storage: MainboardStorageConnectorModel
      ) => {
        acc[storage.type] = storage.count;
        return acc;
      },
      {}
    );
  }

  set storage_connectors(value: Mainboard.StorageConnectorType | null) {
    if (!value) return;

    for (const [type, count] of Object.entries(value)) {
      MainboardStorageConnectorModel.findOrCreate({
        where: { id: this.id, type },
        defaults: { count },
      }).then(([value, created]) => {
        if (!created) value.update({ count });
      });
    }
  }

  /**
   * Declare the usb connector object as a virtual column
   * extracting the {@link usb_data} assossiated with
   * {@link MainboardUSBConnectorModel} from the model
   * and converting it to a {@link Mainboard.USBConnectorType} object.
   */

  @HasMany(() => MainboardUSBConnectorModel)
  declare usb_data: MainboardUSBConnectorModel[] | null;

  @Column(DataType.VIRTUAL)
  get usb_connectors(): Mainboard.USBConnectorType | null {
    const usbData = this.getDataValue(
      "usb_data"
    ) as MainboardUSBConnectorModel[];
    if (!usbData) return null;

    return usbData.reduce(
      (acc: Mainboard.USBConnectorType, usb: MainboardUSBConnectorModel) => {
        const usbStr = USBExchanger.toString(usb);
        acc[usbStr] = usb.count;
        return acc;
      },
      {}
    );
  }

  set usb_connectors(value: Mainboard.USBConnectorType | null) {
    if (!value) return;

    for (const [usb, count] of Object.entries(value)) {
      const { generation, connector } = USBExchanger.toObject(usb);

      MainboardUSBConnectorModel.findOrCreate({
        where: { id: this.id, generation, connector },
        defaults: { count },
      }).then(([value, created]) => {
        if (!created) value.update({ count });
      });
    }
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
    validate: { isIn: [InternalConnectors.PCIe.Controllers.options] },
  })
  declare controller: InternalConnectors.PCIe.ControllerType;

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
    validate: { isIn: [[...HDDInterfaces.options, ...SSDInterfaces.options]] },
  })
  declare type: keyof Mainboard.StorageConnectorType;

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
    validate: { isIn: [ExternalPorts.USB.Generations.options] },
  })
  declare generation: ExternalPorts.USB.GenerationType;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    validate: { isIn: [ExternalPorts.USB.Connectors.options] },
  })
  declare connector: ExternalPorts.USB.ConnectorType;

  @Column(DataType.TINYINT)
  declare count: number;
}

export {
  MainboardModel,
  MainboardPCIeModel,
  MainboardStorageConnectorModel,
  MainboardUSBConnectorModel,
};
