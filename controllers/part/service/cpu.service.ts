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

  async create(options: Options): Promise<Detail | string> {
    const instance = await this.buildPart(options);
    if (!instance || typeof instance === "string") return instance;

    await this.setDetailModel(instance, options, Products.GPU);

    await instance.save();
    await Promise.all([
      instance[this.part].save(),
      instance[Products.GPU].save(),
    ]);

    return instance.toJSON();
  }

  async get(id: string): Promise<Detail | null> {
    const instance = await this.getPart(id, GPUModel.scope(ModelScopes.DETAIL));

    return instance?.toJSON() ?? null;
  }

  async set(options: Options, id: string): Promise<Detail | string | null> {
    const instance = await this.setPart(
      options,
      id,
      GPUModel.scope(ModelScopes.DETAIL)
    );
    if (!instance || typeof instance === "string") return instance;

    await this.setDetailModel(instance, options, Products.GPU);

    await instance.save();
    await Promise.all([
      instance[this.part].save(),
      instance[Products.GPU].save(),
    ]);

    return instance.toJSON();
  }

  async delete(id: string): Promise<Detail | null> {
    const instance = await this.getPart(id, GPUModel.scope(ModelScopes.DETAIL));
    if (!instance || typeof instance === "string") return instance;

    instance.destroy();

    return instance.toJSON();
  }
}

export { CPUService };
