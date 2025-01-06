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
  PowerConnectorExchanger,
  PCIeExchanger,
  USBExchanger,
} from "@/utils/extract/Connector";
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
import { SaveOptions } from "sequelize";

@Scopes(() => ({
  [ModelScopes.SUMMARY]: { attributes: ["id", ...Mainboard.SummaryAttributes] },
  [ModelScopes.FILTER]: (options: Mainboard.FilterOptions) => ({
    where: options,
  }),
  [ModelScopes.DETAIL]: {
    ...PartDefaultScope,
    include: [
      MainboardPCIeModel,
      MainboardStorageConnectorModel,
      MainboardUSBConnectorModel,
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
  get pcies(): Mainboard.PCIe | undefined {
    const pcieData: MainboardPCIeModel[] | undefined = ({} =
      this.getDataValue("pcie_data"));

    if (!pcieData) return undefined;

    this.setDataValue("pcie_data", undefined);
    return pcieData.reduce((acc: Mainboard.PCIe, pcie: MainboardPCIeModel) => {
      const controller = pcie.controller;
      if (!acc[controller]) acc[controller] = {};

      acc[controller][PCIeExchanger.toString(pcie)] = pcie.count;
      return acc;
    }, {});
  }

  set pcies(data: Mainboard.PCIe | null) {
    const current: MainboardPCIeModel[] | undefined =
      this.getDataValue("pcie_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.pcieResolver(data, current ?? []);

    this.pcie_data = newData;
    this.setDataValue("pcie_data", newData);
  }

  private pcieResolver(
    data: Mainboard.PCIe,
    current: MainboardPCIeModel[]
  ): MainboardPCIeModel[] {
    const currentSideModels = current.reduce((acc, value) => {
      const controller = value.controller;

      if (!acc[controller]) acc[controller] = [];
      acc[controller].push(value);

      return acc;
    }, {} as { [key in InternalConnectors.PCIe.Controller]?: MainboardPCIeModel[] });

    InternalConnectors.PCIe.Controller.options.forEach((controller) => {
      if (!data[controller]) {
        currentSideModels[controller]?.map((value) => value.destroy());
        delete currentSideModels[controller];
        return;
      }

      if (!currentSideModels[controller]) {
        currentSideModels[controller] = Object.entries(data[controller]).map(
          ([key, count]) => {
            const { width, version } = PCIeExchanger.toObject(key);

            return MainboardPCIeModel.build({
              id: this.id,
              controller,
              width,
              version,
              count,
            });
          }
        );
        return;
      }

      currentSideModels[controller] = this.controllerPCIeResolver(
        controller,
        data[controller],
        currentSideModels[controller]
      );
    });

    return Object.values(currentSideModels).reduce((acc, value) => {
      acc.push(...value);
      return acc;
    }, []);
  }

  private controllerPCIeResolver(
    controller: InternalConnectors.PCIe.Controller,
    data: Record<string, number>,
    current: MainboardPCIeModel[]
  ): MainboardPCIeModel[] {
    const newData = current.reduce((acc, val) => {
      acc[PCIeExchanger.toString(val)] = val;
      return acc;
    }, {} as { [key in string]: MainboardPCIeModel });

    Object.entries(data).forEach(([key, count]) => {
      if (!newData[key]) {
        const { width, version } = PCIeExchanger.toObject(key);
        newData[key] = MainboardPCIeModel.build({
          id: this.id,
          controller,
          width,
          version,
        });
      }
      newData[key].count = count;
    });

    Object.keys(newData)
      .filter((value) => !Object.keys(data).includes(value))
      .forEach((value) => {
        newData[value]?.destroy();
        delete newData[value];
      });

    return Object.values(newData);
  }

  /**
   * Declare the power connector object as a virtual column
   * extracting the data from the {@link main_power_connectors},
   * {@link cpu_power_connectors}, {@link pcie_power_connectors} columns
   * and converting it to a {@link Mainboard.PowerConnector} object.
   */

  @Column(DataType.VIRTUAL)
  get power_connectors(): Mainboard.PowerConnector | undefined {
    const main = this.getDataValue("main_power_connectors");
    const cpu = this.getDataValue("cpu_power_connectors");
    const pcie = this.getDataValue("pcie_power_connectors");

    return PowerConnectorExchanger.toObject({ main, cpu, pcie }) ?? undefined;
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
  get fan_connectors(): Record<string, number> | undefined {
    const data = this.getDataValue("fan_connectors");

    return data ? JSON.parse(data) : undefined;
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
  get storage_connectors(): Mainboard.StorageConnector | undefined {
    const storageData: MainboardStorageConnectorModel[] | undefined =
      this.getDataValue("storage_connector_data");

    if (!storageData) return undefined;

    this.setDataValue("storage_connector_data", undefined);
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

  set storage_connectors(data: Mainboard.StorageConnector | null) {
    const current: MainboardStorageConnectorModel[] | undefined =
      this.getDataValue("storage_connector_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.storageResolver(data, current ?? []);

    this.storage_connector_data = newData;
    this.setDataValue("storage_connector_data", newData);
  }

  private storageResolver(
    data: Mainboard.StorageConnector,
    current: MainboardStorageConnectorModel[]
  ): MainboardStorageConnectorModel[] {
    const newData = current.reduce((acc, val) => {
      acc[val.type] = val;
      return acc;
    }, {} as { [key in InternalConnectors.Storage]?: MainboardStorageConnectorModel });

    Object.entries(data).forEach(([key, count]) => {
      const type = key as InternalConnectors.Storage;
      if (!newData[type]) {
        newData[type] = MainboardStorageConnectorModel.build({
          id: this.id,
          type,
        });
      }
      newData[type].count = count;
    });

    Object.keys(newData)
      .filter(
        (value) =>
          !Object.keys(data).includes(value as InternalConnectors.Storage)
      )
      .forEach((value) => {
        const type = value as InternalConnectors.Storage;
        newData[type]?.destroy();
        delete newData[type];
      });

    return Object.values(newData);
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
  get usb_connectors(): Mainboard.USBConnector | undefined {
    const usbData: MainboardUSBConnectorModel[] | undefined =
      this.getDataValue("usb_data");

    if (!usbData) return undefined;

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

  set usb_connectors(data: Mainboard.USBConnector | null) {
    const current: MainboardUSBConnectorModel[] | undefined =
      this.getDataValue("usb_data");

    if (data === null && current) current.map((value) => value.destroy());

    if (!data) return;

    const newData = this.usbResolver(data, current ?? []);

    this.usb_data = newData;
    this.setDataValue("usb_data", newData);
  }

  private usbResolver(
    data: Mainboard.USBConnector,
    current: MainboardUSBConnectorModel[]
  ): MainboardUSBConnectorModel[] {
    const newData = current.reduce((acc, val) => {
      const key = USBExchanger.toString(val);
      acc[key] = val;
      return acc;
    }, {} as { [key in string]: MainboardUSBConnectorModel });

    Object.entries(data).forEach(([key, count]) => {
      const { generation, connector } = USBExchanger.toObject(key);
      if (!newData[key]) {
        newData[key] = MainboardUSBConnectorModel.build({
          id: this.id,
          generation,
          connector,
        });
      }
      newData[key].count = count;
    });

    Object.keys(newData)
      .filter((value) => !Object.keys(data).includes(value))
      .forEach((value) => {
        newData[value]?.destroy();
        delete newData[value];
      });

    return Object.values(newData);
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

  async save(options?: SaveOptions<any> | undefined): Promise<this> {
    const result = await super.save(options);

    await Promise.all([
      ...this.pcie_data?.map((pcie) => pcie.save(options)),
      ...this.storage_connector_data?.map((storage) => storage.save(options)),
      ...this.usb_data?.map((usb) => usb.save(options)),
    ]);

    return result;
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
