import {
  LIST_INTERFACE,
  DatabaseListInterface,
} from "controllers/part/interface/database.interface";
import {
  PARSE_INTERFACE,
  ParseServiceInterface,
} from "controllers/part/interface/part.interface";
import Build from "@/utils/interface/build";
import Part, { Information, Mapping } from "@/utils/interface/part";
import { Infos, Products } from "@/utils/Enum";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
class BuildService {
  constructor(
    @Inject(PARSE_INTERFACE)
    private parseService: ParseServiceInterface,
    @Inject(LIST_INTERFACE)
    private partDatabase: DatabaseListInterface
  ) {}

  async getPartDetails(
    options: Partial<Build.List>
  ): Promise<Partial<Build.Details>> {
    return (await this.getBuildPartList(
      options,
      Mapping.SummaryAttributeMapping,
      this.parseService.summary
    )) as Partial<Build.Details>;
  }

  async getSuitablePart(
    product: Products,
    buildList: Partial<Build.List>,
    params: Record<string, string | string[]>
  ) {
    const buildDetails = (await this.getBuildPartList(
      buildList,
      Build.RelevantProductFilterAttributes[product] ?? {}
    )) as Partial<Build.Details>;

    const buildOptions = Build.ProductRules[product]?.reduce((acc, rule) => {
      const validateObject = this.getRuleValidateAttributes(rule, buildDetails);
      const filter = rule.filter(validateObject);

      Object.entries(rule.attributes).forEach(([key, value]) => {
        const [filterProduct, info, attr] = value;

        if (filterProduct !== product) return;

        if (!filter[key]) return;

        acc[info] = attr ? { ...acc[info], [attr]: filter[key] } : filter[key];
      });

      return acc;
    }, {} as Part.Filter);

    const options = this.parseService.options(params, product);

    const { list, total } = await this.partDatabase.list(
      { ...options, ...buildOptions },
      Mapping.SummaryAttributeMapping[product]
    );

    return {
      list: list.map((item) => this.parseService.summary(item, product)),
      total,
    };
  }

  async validate(buildList: Partial<Build.List>) {
    const buildDetails = (await this.getBuildPartList(
      buildList,
      Build.ProductValidateAttributes
    )) as Partial<Build.Details>;

    const rules = Build.Rules.map((rule) => {
      const validateObject = this.getRuleValidateAttributes(rule, buildDetails);
      const isValid = rule.validate(validateObject);

      return {
        rule,
        isValid,
        validateObject,
      };
    });

    return rules;
  }

  /**
   * Get the list of parts for a specific build.
   * This method retrieves the part details based on the provided build
   * and product information mapping.
   *
   * @param build - The build details to retrieve parts for.
   * @param productInfoMapping - The mapping of product information.
   * @param transform - Optional transformation function for part details.
   * @returns A promise that resolves to an object containing part details.
   */
  protected async getBuildPartList<T = Part.Detail>(
    build: Partial<Build.List>,
    productInfoMapping: { [prod in Products]?: { [info in Infos]?: string[] } },
    transform?: (data: Part.Detail, product: Products) => T
  ): Promise<{ [key in Products]?: T | T[] }> {
    const promises = await Promise.all(
      Object.entries(productInfoMapping).map(async ([key, infoMapping]) => {
        const product = key as Products;

        if (!build[product]) return undefined; // Check if the product is in the build

        const ids: string[] = Array.isArray(build[product])
          ? build[product]
          : [build[product]]; // Ensure list is an array

        if (ids.length === 0) return undefined; // Check if the list is empty

        const { list } = await this.partDatabase.list(
          { part: { id: ids }, page: 1, limit: ids.length },
          infoMapping
        ); // Fetch the part details from the database

        // Transform the part details if a transform function is provided
        const transformed = transform
          ? list.map((item) => transform(item, product))
          : list;

        // If the product is an array, return the entire list; otherwise, return the first item
        const result = Array.isArray(build[product])
          ? transformed
          : transformed[0];

        return [product, result];
      })
    );

    const result = await Promise.all(promises);

    const buildDetails = Object.fromEntries(
      result.filter((val) => val !== undefined)
    ) as Partial<Build.Details>;

    return buildDetails as { [key in Products]?: T | T[] };
  }

  /**
   * Get the validation object for a specific rule and build.
   * This method extracts the relevant information from the build
   * based on the rule's validation object.
   *
   * @param rule - The rule to validate against.
   * @param build - The build details to validate.
   * @returns The validation object for the rule.
   */
  protected getRuleValidateAttributes<T extends Build.AttributeMapping>(
    rule: Build.Rule<T>,
    build: Partial<Build.Details>
  ) {
    const filter = Object.entries(rule.attributes).reduce(
      (acc, [key, tuple]) => {
        const validateAttr = key as keyof T;
        const [product, info, attr] = tuple; // Extract product, info, and attribute from the tuple

        if (!build[product]) return acc; // Check if the product exists in the build

        let parsedInfo: any = undefined; // Initialize parsedInfo
        if (Array.isArray(build[product])) {
          parsedInfo = build[product]
            .map((detail) => this.parseDetail(detail, info, attr))
            .filter((val) => val); // If the product is an array, map over it

          if (parsedInfo.length === 0) return acc; // Check if the parsed info is valid
        } else {
          parsedInfo = this.parseDetail(build[product], info, attr); // Parse the detail based on the info and attribute

          if (!parsedInfo) return acc; // Check if the parsed info is valid
        }
        acc[validateAttr] = parsedInfo; // Assign the parsed info to the key

        return acc;
      },
      {} as { [key in keyof T]: any }
    );

    return filter as Build.ValidateAttributes<T>;
  }

  /**
   * Parse the detail of a specific part based on the provided info and attribute.
   * This method retrieves the relevant information from the part detail
   * based on the specified info and attribute.
   *
   * @param detail - The part detail to parse.
   * @param info - The information to retrieve from the detail.
   * @param attr - Optional attribute to specify which part of the info to retrieve.
   * @returns The parsed information from the part detail.
   */
  protected parseDetail(detail: Part.Detail, info: Infos, attr?: string) {
    let result = detail[info];

    if (result && attr) {
      const attribute = attr as keyof Information.Info[Infos];

      result = Array.isArray(result)
        ? result.map((val) => val[attribute]).filter((val) => val) // If info is an array, map over it
        : result[attribute]; // If info is an object, return the specific attribute
    }

    if (!attr) return undefined;

    if (!Array.isArray(result)) return result; // If the result is not an array, return it

    return result.length > 0 ? result : undefined; // If the result is an array, return it if it has values
  }
}

export { BuildService };
