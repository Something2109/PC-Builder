import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import SSDProduct from "@/utils/interface/product/SSD";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Products, Infos } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof SSDProduct.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = SSDProduct.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.SSD]>
    >()
      .add("memory_type", parsedParams["memory_type"])
      .add("form_factor", parsedParams["form_factor"])
      .add("capacity", parsedParams["capacity"])
      .add("interface", parsedParams["interface"])
      .add("read_speed", parsedParams["read_speed"])
      .add("write_speed", parsedParams["write_speed"]);

    if (options.build()) result[Infos.SSD] = options.build();

    return result;
  }
}

export { SSDService };
