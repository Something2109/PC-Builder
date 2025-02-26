import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import Pump from "@/utils/interface/product/Pump";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof Pump.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class PumpService extends BaseDetailPartService<Detail> {
  readonly part = Products.PUMP;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = Pump.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.PUMP]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("flow_rate", parsedParams["flow_rate"])
      .add("power_connector", parsedParams["power_connector"])
      .add("control_connector", parsedParams["control_connector"]);

    if (options.build()) result[Infos.PUMP] = options.build();

    return result;
  }
}

export { PumpService };
