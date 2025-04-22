import { Injectable } from "@nestjs/common";
import { ModelStatic } from "sequelize";
import { PartInformation } from "@/models/parts";
import {
  CaseMainboardSupportModel,
  CaseModel,
  CasePSUSupportModel,
  CaseRadiatorSupportModel,
} from "@/models/parts/tables/Case";
import { ModelScopes } from "@/models/interface";
import Part, { Mapping } from "@/utils/interface/part";
import Case from "@/utils/interface/part/product/Case";
import { Products, Infos } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { FormFactor } from "@/utils/interface/utils";
import { APIMapping } from "@/utils/interface/api";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Infos.CASE][number]]: Part.Detail[key];
};
type Filter = Part.Filter & Case.Filter;

@Injectable()
class CaseService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.CASE;

  protected async filterPart(
    options: Part.Filter & APIMapping.PageOptions,
    attributes?: string[],
    include?: { [key in Infos]?: ModelStatic<any> }
  ) {
    options[Infos.CASE] = options[Infos.CASE] ?? {};
    const filter = options[Infos.CASE] ?? {};

    const CasePartInclude = {
      model: CaseModel.scope({ method: [ModelScopes.FILTER, filter] }),
      attributes: [],
      include: [
        {
          model: PartInformation.scope({
            method: [ModelScopes.FILTER, options.part],
          }),
          attributes: [],
        },
      ],
    };

    if (!filter.mainboard_support)
      filter.mainboard_support = (await this.filterAttribute(
        CaseMainboardSupportModel,
        options,
        "form_factor",
        CasePartInclude
      )) as FormFactor.Mainboard[];

    if (!filter.psu_support)
      filter.psu_support = (await this.filterAttribute(
        CasePSUSupportModel,
        options,
        "form_factor",
        CasePartInclude
      )) as FormFactor.PSU[];

    if (!filter.radiator_support)
      filter.radiator_support = (await this.filterAttribute(
        CaseRadiatorSupportModel,
        options,
        "form_factor",
        CasePartInclude
      )) as FormFactor.Radiator[];

    return await super.filterPart(options, attributes, include);
  }
}

export { CaseService };
