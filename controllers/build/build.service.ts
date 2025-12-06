import {
  LIST_INTERFACE,
  DatabaseListInterface,
} from "controllers/part/interface/database.interface";
import {
  PARSE_INTERFACE,
  ParseServiceInterface,
} from "controllers/part/interface/part.interface";
import Build from "@/utils/build";
import Part, { Infos, Products, Information, Mapping } from "@/utils/part";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

@Injectable()
class BuildService {
  constructor(
    @Inject(PARSE_INTERFACE)
    private parseService: ParseServiceInterface,
    @Inject(LIST_INTERFACE)
    private partDatabase: DatabaseListInterface
  ) {}

  async getPartDetails(options: Partial<Build.List>) {
    return await this.getBuildDetail(
      options,
      Mapping.SummaryAttributeMapping,
      this.parseService.summary
    );
  }

  async getSuitablePart(
    product: Products,
    buildList: Partial<Build.List>,
    params: Record<string, string | string[]>
  ) {
    const buildDetails = await this.getBuildDetail(
      buildList,
      Build.Product.RelevantFilterAttributes[product] ?? {}
    );

    const buildOptions = this.getFilterFromBuild(product, buildDetails);

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
    const buildDetails = await this.getBuildDetail(
      buildList,
      Build.Product.ValidateAttributes
    );

    const genericResult = Build.Rule.Product.validate(buildDetails);

    const result = Build.Rule.Attribute.reduce(
      (acc, rule) => {
        const errors = this.validateRule(rule, buildDetails);

        if (!errors) return acc;

        if (errors["attributes"] !== undefined) {
          acc.rules[rule.name] = errors;
          return acc;
        }

        Object.entries(errors.missing).forEach(([id, error]) => {
          if (!acc.missing[id]) acc.missing[id] = {};
          acc.missing[id][rule.name] = error;
        });

        return acc;
      },
      { rules: {}, missing: {} } as Omit<Build.Result, "products">
    );

    return {
      products: genericResult,
      ...result,
    };
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
  protected async getBuildDetail<T = Part.Model>(
    build: Partial<Build.List>,
    productInfoMapping: { [prod in Products]?: { [info in Infos]?: string[] } },
    transform?: (data: Part.Model, product: Products) => T
  ): Promise<Partial<Build.Details<T>>> {
    const promises = Object.values(Products).map(async (key) => {
      const product = key as Products;

      if (!build[product]) return undefined; // Check if the product is in the build

      const list = await this.fetchProductDetails(
        product,
        build[product],
        productInfoMapping[product]
      ); // Fetch the part details from the database

      if (!list) return undefined; // Check if the list is valid

      if (transform) {
        const result = Array.isArray(list)
          ? list.map((item) => transform(item, product))
          : transform(list, product); // Transform the part details if a transform function is provided

        return [product, result];
      }

      return [product, list];
    });

    const result = await Promise.all(promises);

    const buildDetails = Object.fromEntries(
      result.filter((val) => val !== undefined)
    );

    return buildDetails as Partial<Build.Details<T>>;
  }

  /**
   * Fetch product details from the database.
   * This method retrieves the part details based on the provided IDs
   * and attributes, returning either a single detail or an array of details.
   *
   * @param fetchIds - The IDs of the products to fetch details for.
   * @param attributes - The attributes to retrieve for each product.
   * @returns A promise that resolves to the part details.
   */
  protected async fetchProductDetails(
    product: Products,
    fetchIds: Readonly<string | string[]>,
    attributes?: { [key in Infos]?: string[] }
  ): Promise<Part.Model | Part.Model[] | undefined> {
    const ids: string[] = Array.isArray(fetchIds) ? fetchIds : [fetchIds]; // Ensure list is an array

    if (ids.length === 0) return undefined; // Check if the list is empty

    try {
      const { list: raw } = await this.partDatabase.list(
        { part: { id: ids }, page: 1, limit: ids.length },
        attributes
      ); // Fetch the part details from the database

      const list = raw.filter((item) => item.part === product);

      if (!list || list.length === 0) return undefined; // Check if the list is valid

      return Array.isArray(fetchIds) ? list : list[0]; // Return the list or the first item based on fetchIds type
    } catch (err) {
      const error = err as Error;
      throw new InternalServerErrorException(
        `Failed to fetch product details: ${error.message}`
      );
    }
  }

  /**
   * Get the filter from the build details for a specific product.
   * This method extracts the relevant information from the build
   * based on the product's rules and returns a filter object.
   *
   * @param product - The product to filter by.
   * @param buildDetails - The build details to extract the filter from.
   * @returns The filter object for the specified product.
   */
  protected getFilterFromBuild(
    product: Products,
    buildDetails: Partial<Build.Details>
  ): Part.Filter {
    const buildOptions = Build.Product.Rule[product]?.reduce((acc, rule) => {
      const validateObject = this.getValidateAttributes(rule, buildDetails);
      const filter = rule.filter(validateObject);

      Object.entries(rule.attributes).forEach(([key, value]) => {
        const [filterProduct, info, attr] = value;

        if (filterProduct !== product) return;

        if (!filter[key]) return;

        acc[info] = attr ? { ...acc[info], [attr]: filter[key] } : filter[key];
      });

      return acc;
    }, {} as Part.Filter);

    return buildOptions ?? {};
  }

  /**
   * Validate a specific rule against the build details.
   * This method checks if the build contains the necessary products
   * and validates the attributes based on the rule.
   * If the validation fails, it returns an error message.
   * @param rule - The rule to validate against.
   * @param build - The build details to validate.
   * @returns A string error message if validation fails, otherwise undefined.
   */
  protected validateRule<T extends Build.Rule.Mapping>(
    rule: Build.Rule<T>,
    build: Partial<Build.Details>
  ) {
    const hasProducts = Object.values(rule.attributes).reduce(
      (acc, [product]) => {
        if (Array.isArray(build[product])) {
          return acc && build[product].length > 0;
        }
        return acc && Boolean(build[product]);
      },
      true
    );

    if (!hasProducts) return;

    const attributes = this.getValidateAttributes(rule, build);
    const validateResult = rule.validate(attributes);

    if (!validateResult || typeof validateResult === "string")
      return { error: validateResult, attributes };

    return { missing: this.parseValidateResult(rule, build, validateResult) };
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
  protected getValidateAttributes<T extends Build.Rule.Mapping>(
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
          parsedInfo = build[product].map((detail) =>
            this.parseDetail(detail, info, attr)
          ); // If the product is an array, map over it

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

    return filter as Build.Rule.Attributes<T>;
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
  protected parseDetail(detail: Part.Model, info: Infos, attr?: string) {
    let result = detail[info];

    if (!result) return undefined;

    if (attr) {
      const attribute = attr as keyof Information.Info[Infos];
      result = Array.isArray(result)
        ? result.map((val) => val[attribute])
        : result[attribute];
    }

    return result;
  }

  /**
   * Parse the validation result for a specific rule and build.
   * This method processes the validation result and maps it to the build details.
   *
   * @param rule - The rule to parse the validation result for.
   * @param build - The build details to parse the validation result against.
   * @param result - The validation result to parse.
   * @returns A record mapping product IDs to their respective validation errors.
   */
  protected parseValidateResult<T extends Build.Rule.Mapping>(
    rule: Build.Rule<T>,
    build: Partial<Build.Details>,
    result: Build.Rule.Result<T>
  ) {
    const parsed: Record<string, string[]> = {};

    Object.entries(result).forEach(([key, value]) => {
      const validateAttr = key as keyof T;
      const [product] = rule.attributes[validateAttr];

      if (!Array.isArray(value) && !Array.isArray(build[product])) {
        const id = build[product]!.id;
        if (!parsed[id]) parsed[id] = [];
        parsed[id] = [...parsed[id], value];
        return;
      }

      value.forEach((error: string[] | string | undefined, index: number) => {
        if (!error || !Array.isArray(build[product])) return undefined;
        const id = build[product][index].id;
        if (!parsed[id]) parsed[id] = [];
        parsed[id] = Array.isArray(error)
          ? [...parsed[id], ...error]
          : [...parsed[id], error];
      });
    });

    return parsed;
  }
}

export { BuildService };
