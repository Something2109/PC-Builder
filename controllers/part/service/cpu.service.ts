import { Includeable } from "sequelize";
import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import CPU from "@/utils/interface/part/CPU";
import { CPUModel } from "@/models/parts/tables/CPU";
import GPU from "@/utils/interface/part/GPU";
import { GPUModel } from "@/models/parts/tables/GPU";
import {
  BaseDetailPartService,
  PageOptions,
  SearchOptions,
} from "../interface/service.interface";
import {
  DetailInfoOptions as Options,
  FilterOptions as Filter,
} from "@/utils/interface";

type Detail = Part.BasicInfo & {
  [Products.CPU]: CPU.Info;
  [Products.GPU]?: GPU.Info;
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;

  async list(options?: Filter & PageOptions & SearchOptions) {
    const { part, [this.part]: cpu, gpu } = options ?? {};

    const FilteredPart = PartInformation.scope([
      ModelScopes.SUMMARY,
      { method: [ModelScopes.FILTER, { ...part, part: [this.part] }] },
    ]);

    const include: Includeable[] = [
      {
        model: CPUModel.scope([
          ModelScopes.SUMMARY,
          { method: [ModelScopes.FILTER, cpu] },
        ]),
        required: true,
      },
      {
        model: GPUModel.scope([
          ModelScopes.SUMMARY,
          { method: [ModelScopes.FILTER, gpu] },
        ]),
        required: options?.gpu === null,
      },
    ];

    const { rows, count } = await this.listFromPart(
      FilteredPart,
      options ?? {},
      ...include
    );

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

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

  protected async buildPart(
    options: Options
  ): Promise<PartInformation | string> {
    const instance = await super.buildPart(
      options,
      GPUModel.scope(ModelScopes.DETAIL)
    );

    if (typeof instance === "string") return instance;

    await this.setDetailModel(instance, options, Products.GPU);

    return instance;
  }

  protected async getPart(id: string): Promise<PartInformation | null> {
    return super.getPart(id, GPUModel.scope(ModelScopes.DETAIL));
  }

  protected async setPart(
    options: Options,
    id: string
  ): Promise<PartInformation | string | null> {
    const instance = await super.setPart(
      options,
      id,
      GPUModel.scope(ModelScopes.DETAIL)
    );

    if (!instance || typeof instance === "string") return instance;

    await this.setDetailModel(instance, options, Products.GPU);

    return instance;
  }

  protected async savePart(instance: PartInformation): Promise<void> {
    await instance.save();
    await Promise.all([
      instance[this.part]?.save(),
      instance[Products.GPU]?.save(),
    ]);
  }
}

export { CPUService };
