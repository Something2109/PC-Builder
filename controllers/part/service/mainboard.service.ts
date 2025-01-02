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

  async set(
    { [this.part]: data, ...part }: Options,
    id: string
  ): Promise<Detail | string | null> {
    let pcies: Mainboard.PCIeType | undefined,
      storage_connectors: Mainboard.StorageConnectorType | undefined,
      usb_connectors: Mainboard.USBConnectorType | undefined;
    if (data) {
      const { pcies, storage_connectors, usb_connectors, ...rest } = data;
      data = rest;
    }

    const partInstance = await super.set({ ...part, mainboard: data }, id);
    if (!partInstance || typeof partInstance === "string") return partInstance;

    id = partInstance.id;

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

    if (usb_connectors) {
      await MainboardUSBConnectorModel.destroy({ where: { id } });

      await MainboardUSBConnectorModel.bulkCreate(
        Object.entries(usb_connectors).map(([usb, count]) => {
          const { generation, connector } = USBExchanger.toObject(usb);
          return { id, generation, connector, count };
        })
      );
    }

    return (await this.get(partInstance.id)) as Detail;
  }
}

export { MainboardService };
