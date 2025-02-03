import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import Pump from "@/utils/interface/part/Pump";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.PUMP]: Pump.Info;
};

@Injectable()
class PumpService extends BaseDetailPartService<Detail> {
  readonly part = Products.PUMP;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options = {};
    this.parse(params, FormFactor.Pump, options, "form_factor");
    this.parse(params, Primitive.Number, options, "flow_rate");
    this.parse(
      params,
      InternalConnectors.Power.Miscellanous,
      options,
      "power_connector"
    );
    this.parse(
      params,
      InternalConnectors.Fan.Connector,
      options,
      "control_connector"
    );

    if (Object.keys(options).length > 0) result[Products.PUMP] = options;

    return result;
  }
}

export { PumpService };
