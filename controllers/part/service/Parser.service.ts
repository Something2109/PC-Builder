import { Injectable } from "@nestjs/common";
import Part, { Product, Mapping } from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Primitive } from "@/utils/interface/utils";
import { Products } from "@/utils/Enum";
import { FilterOptionBuilder } from "../interface/filterbuilder";
import { ParseServiceInterface } from "../interface/part.interface";

@Injectable()
class ParseService implements ParseServiceInterface {
  summary(data: Part.Detail, part?: Products): Part.Summary<Products> {
    const summary: Record<string, any> = {};

    Part.BasicSummaryAttributes.forEach((key) => (summary[key] = data[key]));

    if (part) {
      Product.Summary[part].keyof().options.forEach((key) => {
        const [info, attr] = Mapping.AttributeMapping[part][key];

        if (data[info]) {
          summary[key] = Array.isArray(data[info])
            ? data[info].map((item) => item[attr])
            : (data[info] as any)[attr];
        }
      });
    }

    return summary as Part.Summary<Products>;
  }

  filter(options: Part.Filter, part?: Products, ...attributes: string[]) {
    const filter: Record<string, string[] | number[]> = {};

    const basicOptions = options.part;
    if (basicOptions) {
      Part.BasicFilterAttributes.forEach((key) => {
        if (attributes.length === 0 || attributes.includes(key))
          filter[key] = basicOptions[key]!;
      });
    }

    if (part) {
      if (attributes.length === 0)
        attributes = Object.keys(Mapping.AttributeMapping[part]);

      attributes.forEach((attr) => {
        if (!Mapping.AttributeMapping[part][attr]) return;

        const [info, val] = Mapping.AttributeMapping[part][attr];

        if (options[info]) filter[attr] = options[info][val];
      });
    }

    return filter;
  }

  options(
    params: Record<string, string | string[]>,
    part?: Products
  ): Part.Filter & API.PageOptions & API.SearchOptions {
    const pageOptions: API.PageOptions & API.SearchOptions =
      API.toPageOptions(params);

    if (params.q) {
      pageOptions.q = Array.isArray(params.q) ? params.q.join("|") : params.q;
    }

    const filter = this.buildFilterOptions(params, part);

    return { ...filter.build(), ...pageOptions };
  }

  /**
   * Create the filter option builder and add the attributes
   * according to the filter mapping
   * @param params The object of string key and string/string array value.
   * @returns The filter option builder extracted from the {@link params}.
   */
  protected buildFilterOptions(
    params: Record<string, string | string[]>,
    part?: Products
  ): FilterOptionBuilder {
    const builder = new FilterOptionBuilder();

    for (const key of Part.BasicFilterAttributes) {
      let option = params[key];

      if (!option) continue;

      if (!Array.isArray(option)) option = [option];

      const parsedOption = option
        .map((val) => Primitive.String.safeParse(val))
        .filter((val) => val.success)
        .map((val) => val.data);

      builder.add("part", key, parsedOption);
    }

    if (part) {
      const parsedParams = Product.FilterOptions[part].parse(params);

      for (const name in Mapping.AttributeMapping[part]) {
        const [info, key] = Mapping.AttributeMapping[part][name];
        builder.add(info, key, parsedParams[name]);
      }
    }

    return builder;
  }
}

export { ParseService };
