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

type Detail = Part.BasicInfo & {
  [Products.MAIN]: Mainboard.Info;
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;

  async create({
    [this.part]: data,
    ...part
  }: Options): Promise<string | Detail> {
    let pcies: Mainboard.PCIe | undefined,
      storage_connectors: Mainboard.StorageConnector | undefined,
      usb_connectors: Mainboard.USBConnector | undefined;
    if (data) ({ pcies, storage_connectors, usb_connectors, ...data } = data);

    const partInstance = await this.buildPart({ ...part, mainboard: data });
    if (typeof partInstance === "string") return partInstance;

    await partInstance.save();
    await partInstance[this.part]?.save();

    Promise.all([
      this.setPCIe(partInstance.id, pcies),
      this.setStorageConnector(partInstance.id, storage_connectors),
      this.setUSBConnector(partInstance.id, usb_connectors),
    ]);

    return (await this.get(partInstance.id)) as Detail;
  }

  async set(
    { [this.part]: data, ...part }: Options,
    id: string
  ): Promise<Detail | string | null> {
    let pcies: Mainboard.PCIe | undefined,
      storage_connectors: Mainboard.StorageConnector | undefined,
      usb_connectors: Mainboard.USBConnector | undefined;
    if (data) ({ pcies, storage_connectors, usb_connectors, ...data } = data);

    const partInstance = await this.setPart({ ...part, mainboard: data }, id);
    if (!partInstance || typeof partInstance === "string") return partInstance;

    await partInstance.save();
    await partInstance[this.part]?.save();

    Promise.all([
      this.setPCIe(partInstance.id, pcies),
      this.setStorageConnector(partInstance.id, storage_connectors),
      this.setUSBConnector(partInstance.id, usb_connectors),
    ]);

    return (await this.get(partInstance.id)) as Detail;
  }

  private async setPCIe(id: string, pcies?: Mainboard.PCIe) {
    if (pcies) {
      await MainboardPCIeModel.destroy({ where: { id } });

      await MainboardPCIeModel.bulkCreate(
        Object.entries(pcies).reduce((acc, [controller, pcie]) => {
          Object.entries(pcie).forEach(([type, count]) => {
            const { width, version } = PCIeExchanger.toObject(type);
            acc.push({ id, controller, type, count, width, version });
          });
          return acc;
        }, [] as any)
      );
    }
  }

  private async setStorageConnector(
    id: string,
    storage_connectors?: Mainboard.StorageConnector
  ) {
    if (storage_connectors) {
      await MainboardStorageConnectorModel.destroy({ where: { id } });

      await MainboardStorageConnectorModel.bulkCreate(
        Object.entries(storage_connectors).map(([type, count]) => ({
          id,
          type,
          count,
        }))
      );
    }
  }

  private async setUSBConnector(
    id: string,
    usb_connectors?: Mainboard.USBConnector
  ) {
    if (usb_connectors) {
      await MainboardUSBConnectorModel.destroy({ where: { id } });

      await MainboardUSBConnectorModel.bulkCreate(
        Object.entries(usb_connectors).map(([usb, count]) => {
          const { generation, connector } = USBExchanger.toObject(usb);
          return { id, generation, connector, count };
        })
      );
    }
  }
}

export { MainboardService };
