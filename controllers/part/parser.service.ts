import { Injectable } from "@nestjs/common";
import Part, { Product, Mapping } from "@/utils/interface/part";
import { APIMapping } from "@/utils/interface/api";
import { Primitive } from "@/utils/interface/utils";
import { Products } from "@/utils/Enum";
import { FilterOptionBuilder } from "./interface/filterbuilder";

type SearchOptions = {
  q?: string;
};

type PageOptions = APIMapping.PageOptions;

@Injectable()
class ProductParser {
  /**
   * Parse the summary info parameter to the product summary info type.
   * @param data The info to parse.
   * @param part The product type to parse.
   * @returns The summary of the info.
   */
  summary(data: Part.Detail, part?: Products): Part.Summary<Products> {
    const summary: Record<string, any> = {};

    Part.BasicSummaryAttributes.forEach((key) => (summary[key] = data[key]));

    if (part) {
      Product.Summary[part].keyof().options.forEach((key) => {
        const [info, attr] = Mapping.AttributeMapping[part][key];

        summary[key] = data[info] && (data[info] as any)[attr];
      });
    }

    return summary as Part.Summary<Products>;
  }

  /**
   * Create the option to pass into the {@link list} and {@link filter} functions
   * from an object of string or string array value
   * (the object parsed from the {@link URLSearchParams} using Nest Query decorator).
   * @param params The object of string key and string/string array value.
   * @returns The option parsed from the {@link params}.
   */
  options(
    params: Record<string, string | string[]>,
    part?: Products
  ): Part.Filter & PageOptions & SearchOptions {
    const pageOptions: PageOptions & SearchOptions =
      APIMapping.toPageOptions(params);

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

export { ProductParser };
