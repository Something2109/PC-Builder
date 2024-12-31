import { Injectable } from "@nestjs/common";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import { ModelStatic } from "sequelize";
import { FilterOptionsType } from "@/utils/interface/utils";

type DefaultService = "default";

type ListResult<Part> = {
  total: number;
  list: Part[];
};

type PageOptions = {
  page?: number;
  limit?: number;
};

/**
 * A base service class for handling parts data.
 */
@Injectable()
abstract class BasePartService<
  Detail = Part.BasicInfo,
  Filter = { part?: Part.FilterOptions },
  Options = Partial<Part.BasicInfo>
> {
  /**
   * Describe the part type that the service is handling.
   */
  abstract part: Products | DefaultService;

  /**
   * List all parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The list of parts that satisfy the filter options.
   */
  abstract list(options?: Filter & PageOptions): Promise<ListResult<Detail>>;

  /**
   * List all parts that match the given search string
   * and the given {@link Filter} options.
   * @param str The search string to match.
   * @param options The filter options to apply.
   * @returns The list of parts that match the search string.
   */
  abstract search(
    str: string,
    options?: Filter & PageOptions
  ): Promise<ListResult<Detail>>;

  /**
   * Create a new {@link Filter} object that filters
   * the parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The created filter object.
   */
  abstract filter(options?: Filter): Promise<Filter>;

  /**
   * Retrieve the part with the given ID.
   * @param id The ID of the part to retrieve.
   * @returns The part with the given ID, or `null` if the part does not exist.
   */
  abstract get(id: string): Promise<Detail | null>;

  /**
   * Create a new part with the given {@link Options} data.
   * If the part already exists, update it with the new data
   * (Must provide a valid {@link id} to update the part).
   * @param data The data to create the part with.
   * @param id The ID of the part to update.
   * @returns The created or updated part.
   */
  abstract set(data: Options, id?: string): Promise<Detail>;

  /**
   * Delete the part with the given ID.
   * @param id The ID of the part to delete.
   * @returns The deleted part, or `null` if the part does not exist.
   */
  abstract delete(id: string): Promise<Detail | null>;

  /**
   * Create a new {@link FilterOptionsType} object of the model
   * from the given {@link FilterOptionsType} object
   * by getting each {@link attribute} values from the model
   * from the {@link model}. The result value is initial
   * set to the {@link initial} object.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param initial The initial value of the result object.
   * @param attribute The attributes to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created {@link FilterOptionsType} object.
   */
  protected async getFilterOptions<
    Info extends { [key in string]: any },
    Attributes extends keyof Info
  >(
    model: ModelStatic<any>,
    initial: FilterOptionsType<Info, Attributes>,
    attribute: Attributes[],
    ...include: ModelStatic<any>[]
  ): Promise<FilterOptionsType<Info, Attributes>> {
    const result: FilterOptionsType<Info, Attributes> = { ...initial };

    for (const attr of attribute) {
      if (result[attr] && result[attr].length > 0) {
        continue;
      }

      const query = await model.findAll({
        attributes: [attr.toString()],
        group: attr.toString(),
        order: [attr.toString()],
        include: include.map((value) => ({ model: value, attributes: [] })),
      });

      result[attr] = query.map((value) => value[attr]).filter((value) => value);
    }

    return result;
  }

  /**
   * Get the page options from the given {@link PageOptions} object.
   * @param options The options to get the values from.
   * @returns The page and limit options in an object.
   */
  protected getPageOptions(options?: PageOptions) {
    const { page = 0, limit = 50 } = options ?? {};
    return { page, limit };
  }
}

export { BasePartService, type PageOptions };
