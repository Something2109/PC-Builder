import { Injectable } from "@nestjs/common";
import { ModelCtor } from "sequelize-typescript";
import { Includeable } from "sequelize";
import { PartInformation } from "@/models/parts/tables/Part";
import {
  CaseMainboardSupportModel,
  CaseModel,
  CasePSUSupportModel,
  CaseRadiatorSupportModel,
} from "@/models/parts/tables/Case";
import { ModelScopes } from "@/models/interface";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import Case from "@/utils/interface/product/Case";
import { Products, Infos } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { FormFactor } from "@/utils/interface/utils";

type Detail = Part.BasicInfo & {
  [key in (typeof Case.Primary)[number]]: DetailInfo[key];
};
type Filter = Part.FilterOptions & Case.Filter;

@Injectable()
class CaseService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.CASE;

  async filter(options: FilterOptions): Promise<Filter> {
    let { part, [Infos.CASE]: filter } = options;
    filter = filter ?? {};

    const CasePartInclude = {
      model: CaseModel.scope({ method: [ModelScopes.FILTER, filter] }),
      attributes: [],
      include: [
        {
          model: PartInformation.scope({ method: [ModelScopes.FILTER, part] }),
          attributes: [],
        },
      ],
    };

    if (!filter.mainboard_support)
      filter.mainboard_support = (await this.filterAttribute(
        CaseMainboardSupportModel,
        "form_factor",
        CasePartInclude
      )) as FormFactor.Mainboard[];

    if (!filter.psu_support)
      filter.psu_support = (await this.filterAttribute(
        CasePSUSupportModel,
        "form_factor",
        CasePartInclude
      )) as FormFactor.PSU[];

    if (!filter.radiator_support)
      filter.radiator_support = (await this.filterAttribute(
        CaseRadiatorSupportModel,
        "form_factor",
        CasePartInclude
      )) as FormFactor.Radiator[];

    return await super.filter({ part, [this.part]: filter });
  }
}

export { CaseService };
