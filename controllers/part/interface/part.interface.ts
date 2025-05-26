import { ModelAttributeList } from "./database.interface";
import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Products } from "@/utils/Enum";

/**
 * Constant representing the Part interface identifier.
 */
export const PART_INTERFACE = "PartInterface";

/**
 * Constant representing the Parse interface identifier.
 */
export const PARSE_INTERFACE = "ParseInterface";

/**
 * Interface for services that parse part-related data.
 */
export interface ParseServiceInterface {
  /**
   * Parses detailed part information into a summary format.
   *
   * @param data - The detailed part information to parse.
   * @param part - (Optional) The product type to parse.
   * @returns The summarized part information.
   */
  summary(data: Part.Detail, part?: Products): Part.Summary<Products>;

  /**
   * Generates a filter response for the filter function.
   *
   * @param filter - The part filter to parse.
   * @param part - (Optional) The product type of the part filter.
   * @param attributes - The list of attributes to map.
   * @returns A record mapping filter keys to arrays of strings or numbers.
   */
  filter(
    filter: Part.Filter,
    part?: Products,
    ...attributes: string[]
  ): Record<string, string[] | number[]>;

  /**
   * Creates options for list and filter functions from a parameter object.
   *
   * @param params - An object with string keys and string or string array values, typically parsed from URLSearchParams.
   * @param part - (Optional) The product type.
   * @returns The parsed options object.
   */
  options(
    params: Record<string, string | string[]>,
    part?: Products
  ): Part.Filter & API.PageOptions & API.SearchOptions;

  /**
   * Maps a list of attribute names to their corresponding model attribute definitions.
   *
   * @param attributes - The list of attribute names to map.
   * @param part - (Optional) The product type for which to map attributes.
   * @returns The list of model attribute definitions.
   */
  attributes(attributes: string[], part?: Products): ModelAttributeList;
}

/**
 * Interface defining the contract for part-related service operations.
 *
 * Provides methods for listing, filtering, creating, retrieving, updating, and deleting parts.
 * Each method is designed to interact with parts of a specific product type.
 */
export interface PartServiceInterface {
  /**
   * Retrieves a paginated list of part summaries based on provided parameters and optional product type.
   *
   * @param params - Query parameters for filtering and pagination.
   * @param product - (Optional) The product type to filter parts by.
   * @returns A promise resolving to a payload containing part summaries.
   */
  list(
    params: Record<string, string | string[]>,
    product?: Products
  ): Promise<API.Payload<Part.Summary<Products>>>;

  /**
   * Filters parts based on provided parameters, optional product type, and additional attributes.
   *
   * @param params - Query parameters for filtering.
   * @param product - (Optional) The product type to filter parts by.
   * @param attributes - Additional attributes to filter by.
   * @returns A promise resolving to a filter result object.
   */
  filter(
    params: Record<string, string | string[]>,
    product?: Products,
    ...attributes: string[]
  ): Promise<Part.Filter>;

  /**
   * Creates a new part for the specified product type with the given data.
   *
   * @param part - The product type for which the part is being created.
   * @param data - Partial details of the part to create.
   * @returns A promise resolving to the created part detail, or null if creation failed.
   */
  create(
    part: Products,
    data: Partial<Part.Detail>
  ): Promise<Part.Detail | null>;

  /**
   * Retrieves the details of a specific part by its ID and product type.
   *
   * @param id - The unique identifier of the part.
   * @param product - The product type of the part.
   * @returns A promise resolving to the part detail, or null if not found.
   */
  get(id: string, product: Products): Promise<Part.Detail | null>;

  /**
   * Updates an existing part identified by its ID and product type with the provided data.
   *
   * @param id - The unique identifier of the part.
   * @param part - The product type of the part.
   * @param data - Partial details to update the part with.
   * @returns A promise resolving to the updated part detail, or null if update failed.
   */
  set(
    id: string,
    part: Products,
    data: Partial<Part.Detail>
  ): Promise<Part.Detail | null>;

  /**
   * Deletes a part identified by its ID and product type.
   *
   * @param id - The unique identifier of the part to delete.
   * @param product - The product type of the part.
   * @returns A promise resolving to the deleted part detail, or null if deletion failed.
   */
  delete(id: string, product: Products): Promise<Part.Detail | null>;
}
