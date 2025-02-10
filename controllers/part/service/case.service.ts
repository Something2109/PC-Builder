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
import {
  BaseDetailPartService,
  SearchOptions,
} from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Infos.CASE]: DetailInfo[Infos.CASE];
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = Case.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.CASE]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("mainboard_support", parsedParams["mainboard_support"])
      .add("radiator_support", parsedParams["radiator_support"])
      .add("psu_support", parsedParams["psu_support"]);

    if (options.build()) result[Infos.CASE] = options.build();

    return result;
  }

  async filter(options: FilterOptions & SearchOptions): Promise<FilterOptions> {
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

    filter.mainboard_support = await this.getFormFactorFilter(
      CaseMainboardSupportModel,
      CasePartInclude,
      filter?.mainboard_support
    );

    filter.psu_support = await this.getFormFactorFilter(
      CasePSUSupportModel,
      CasePartInclude,
      filter?.psu_support
    );

    filter.radiator_support = await this.getFormFactorFilter(
      CaseRadiatorSupportModel,
      CasePartInclude,
      filter?.radiator_support
    );

    return await super.filter({ part, [this.part]: filter });
  }

  private async getFormFactorFilter<
    FormFactorModel extends
      | CaseMainboardSupportModel
      | CasePSUSupportModel
      | CaseRadiatorSupportModel
  >(
    Model: ModelCtor<FormFactorModel>,
    IncludeModel: Includeable,
    defaultValue?: FormFactorModel["form_factor"][]
  ): Promise<FormFactorModel["form_factor"][]> {
    if (defaultValue) return defaultValue;

    const result = (await Model.findAll({
      include: IncludeModel,
      attributes: ["form_factor"],
      group: ["form_factor"],
      order: ["form_factor"],
      raw: true,
    })) as unknown as FormFactorModel[];

    return result.map((val) => val.form_factor);
  }
}

export { CaseService };
