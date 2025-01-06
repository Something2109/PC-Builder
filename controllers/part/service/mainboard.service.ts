import { Injectable } from "@nestjs/common";
import Mainboard from "@/utils/interface/part/Mainboard";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { PartInformation } from "@/models/parts/tables/Part";

type Detail = Part.BasicInfo & {
  [Products.MAIN]: Mainboard.Info;
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;

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
}

export { MainboardService };
