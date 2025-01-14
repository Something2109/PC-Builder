import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import CPU from "@/utils/interface/part/CPU";
import GPU from "@/utils/interface/part/GPU";
import { GPUModel } from "@/models/parts/tables/GPU";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptions as Filter } from "@/utils/interface";

type Detail = Part.BasicInfo & {
  [Info.CPU]: CPU.Info;
  [Info.GPU]?: GPU.Info;
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;

  async filter(options?: Filter): Promise<Filter> {
    const result: Filter = super.filter(options) as Filter;

    const { part, gpu } = options ?? {};

    if (gpu !== null) {
      const FilteredPart = PartInformation.scope({
        method: [ModelScopes.FILTER, { ...part, part: [this.part] }],
      });
      const FilteredGPU = GPUModel.scope({
        method: [ModelScopes.FILTER, gpu],
      });

      result[Products.GPU] = await this.filterFromModel(
        FilteredGPU,
        gpu ?? {},
        GPU.FilterAttributes,
        FilteredPart
      );
    }

    return result;
  }
}

export { CPUService };
