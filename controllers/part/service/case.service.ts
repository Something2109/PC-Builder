import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import Case from "@/utils/interface/part/Case";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { PartInformation } from "@/models/parts/tables/Part";

type Detail = Part.BasicInfo & {
  [Products.CASE]: Case.Info;
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;

  protected async savePart(instance: PartInformation): Promise<void> {
    await super.savePart(instance);

    const mainboard = instance[this.part];

    if (mainboard) {
      await Promise.all([
        ...mainboard.mainboard_support_data?.map((support) => support.save()),
        ...mainboard.radiator_support_data?.map((support) => support.save()),
        ...mainboard.fan_support_data?.map((support) => support.save()),
        ...mainboard.hard_drive_support_data?.map((support) => support.save()),
        ...mainboard.psu_support_data?.map((support) => support.save()),
      ]);
    }
  }
}

export { CaseService };
