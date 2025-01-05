import { Injectable } from "@nestjs/common";
import {
  MainboardPCIeModel,
  MainboardStorageConnectorModel,
  MainboardUSBConnectorModel,
} from "@/models/parts/tables/Mainboard";
import Mainboard from "@/utils/interface/part/Mainboard";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import { PCIeExchanger, USBExchanger } from "@/utils/extract/Connector";
import { BaseDetailPartService } from "../interface/service.interface";
import { DetailInfoOptions as Options } from "@/utils/interface";
import { PartInformation } from "@/models/parts/tables/Part";

type Detail = Part.BasicInfo & {
  [Products.MAIN]: Mainboard.Info;
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;

  async buildPart({
    [this.part]: data,
    ...part
  }: Options): Promise<string | PartInformation> {
    let pcies: Mainboard.PCIe | undefined,
      storage_connectors: Mainboard.StorageConnector | undefined,
      usb_connectors: Mainboard.USBConnector | undefined;
    if (data) ({ pcies, storage_connectors, usb_connectors, ...data } = data);

    const instance = await super.buildPart({ ...part, mainboard: data });
    if (typeof instance === "string") return instance;

    this.setPCIe(instance, pcies);
    this.setStorageConnector(instance, storage_connectors);
    this.setUSBConnector(instance, usb_connectors);

    return instance;
  }

  async setPart(
    { [this.part]: data, ...part }: Options,
    id: string
  ): Promise<PartInformation | string | null> {
    let pcies: Mainboard.PCIe | undefined,
      storage_connectors: Mainboard.StorageConnector | undefined,
      usb_connectors: Mainboard.USBConnector | undefined;
    if (data) ({ pcies, storage_connectors, usb_connectors, ...data } = data);

    const instance = await super.setPart({ ...part, mainboard: data }, id);
    if (!instance || typeof instance === "string") return instance;

    this.setPCIe(instance, pcies);
    this.setStorageConnector(instance, storage_connectors);
    this.setUSBConnector(instance, usb_connectors);

    return instance;
  }

  protected async savePart(instance: PartInformation): Promise<void> {
    await super.savePart(instance);

    const mainboard = instance[this.part];

    if (mainboard) {
      const promises = [
        ...mainboard.pcie_data?.map((pcie) => pcie.save()),
        ...mainboard.storage_connector_data?.map((storage) => storage.save()),
        ...mainboard.usb_data?.map((usb) => usb.save()),
      ];

      await Promise.all(promises);
    }
  }

  private async setPCIe(
    { [this.part]: instance, id }: PartInformation,
    pcies?: Mainboard.PCIe
  ) {
    if (pcies) {
      await Promise.all([
        instance.pcie_data?.forEach((pcie) => pcie.destroy()),
      ]);

      const pcie_data = Object.entries(pcies).reduce(
        (acc, [controller, pcie]) => {
          Object.entries(pcie).forEach(([type, count]) => {
            const { width, version } = PCIeExchanger.toObject(type);
            acc.push(
              MainboardPCIeModel.build({
                id,
                controller,
                type,
                count,
                width,
                version,
              })
            );
          });
          return acc;
        },
        [] as MainboardPCIeModel[]
      );

      instance.pcie_data = pcie_data;
      instance.dataValues.pcie_data = pcie_data;
    }
  }

  private async setStorageConnector(
    { [this.part]: instance, id }: PartInformation,
    storage_connectors?: Mainboard.StorageConnector
  ) {
    if (instance && storage_connectors) {
      await Promise.all([
        instance.storage_connector_data?.forEach((stg) => stg.destroy()),
      ]);

      const storage_connector_data = MainboardStorageConnectorModel.bulkBuild(
        Object.entries(storage_connectors).map(([type, count]) => ({
          id,
          type,
          count,
        }))
      );

      instance.storage_connector_data = storage_connector_data;
      instance.dataValues.storage_connector_data = storage_connector_data;
    }
  }

  private async setUSBConnector(
    { [this.part]: instance, id }: PartInformation,
    usb_connectors?: Mainboard.USBConnector
  ) {
    if (instance && usb_connectors) {
      await Promise.all([instance.usb_data?.forEach((usb) => usb.destroy())]);

      const usb_data = MainboardUSBConnectorModel.bulkBuild(
        Object.entries(usb_connectors).map(([usb, count]) => {
          const { generation, connector } = USBExchanger.toObject(usb);
          return { id, generation, connector, count };
        })
      );

      instance.usb_data = usb_data;
      instance.dataValues.usb_data = usb_data;
    }
  }
}

export { MainboardService };
