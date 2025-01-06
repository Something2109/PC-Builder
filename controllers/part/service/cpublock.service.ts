import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import CPUBlock from "@/utils/interface/part/CPUBlock";
import { BaseDetailPartService } from "../interface/service.interface";
import { PartInformation } from "@/models/parts/tables/Part";

type Detail = Part.BasicInfo & {
  [Products.CPU_BLOCK]: CPUBlock.Info;
};

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU_BLOCK;

  protected async savePart(instance: PartInformation): Promise<void> {
    await super.savePart(instance);

    const cpuBlock = instance.cpu_block;

    if (cpuBlock) {
      await Promise.all(cpuBlock.socket_data?.map((socket) => socket.save()));
    }
  }
}

export { CPUBlockService };
