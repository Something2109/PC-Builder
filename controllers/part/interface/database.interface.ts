import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Infos } from "@/utils/Enum";

/**
 * Constant identifier for the DatabaseListInterface.
 */
export const LIST_INTERFACE = "DatabaseListInterface";

/**
 * Constant identifier for the DatabaseCRUDInterface.
 */
export const CRUD_INTERFACE = "DatabaseCRUDInterface";

/**
 * Mapping type for attributes.
 * - `part`: Array of basic attributes for a part.
 * - Additional keys are optional and correspond to `Infos` enum values, each mapping to an array of strings.
 */
export type ModelAttributeList = {
  part: Part.BasicAttributes[];
} & { [key in Infos]?: string[] };

/**
 * Interface for listing and filtering parts in the database.
 */
export interface DatabaseListInterface {
  /**
   * Lists parts based on provided filter, pagination, and search options.
   * @param options - Filter, pagination, and search options.
   * @param attrs - Optional mapping of `Infos` to string arrays for additional attributes.
   * @returns A promise resolving to a paginated payload of part details.
   */
  list(
    options: Part.Filter & API.PageOptions & API.SearchOptions,
    attrs?: { [key in Infos]?: string[] }
  ): Promise<API.Payload<Part.Model>>;

  /**
   * Retrieves available filters for parts based on pagination and search options.
   * @param options - Pagination and search options.
   * @param attrs - Mapping of filter attributes.
   * @returns A promise resolving to available part filters.
   */
  filter(
    options: API.PageOptions & API.SearchOptions,
    attrs: ModelAttributeList
  ): Promise<Part.Filter>;
}

/**
 * Interface for CRUD operations on parts in the database.
 */
export interface DatabaseCRUDInterface {
  /**
   * Retrieves the details of a part by its ID.
   * @param id - The unique identifier of the part.
   * @param infos - Optional array of `Infos` specifying which details to retrieve.
   * @returns A promise resolving to the part details or null if not found.
   */
  get(id: string, infos?: readonly Infos[]): Promise<Part.Model | null>;

  /**
   * Updates the details of a part by its ID.
   * @param id - The unique identifier of the part.
   * @param data - The updated part details.
   * @param infos - Optional array of `Infos` specifying which details to return.
   * @returns A promise resolving to the updated part details or null if not found.
   */
  set(
    id: string,
    data: Part.DTO,
    infos?: readonly Infos[]
  ): Promise<Part.Model | null>;

  /**
   * Creates a new part in the database.
   * @param data - The details of the part to create.
   * @param infos - Optional array of `Infos` specifying which details to return.
   * @returns A promise resolving to the created part details or null if creation failed.
   */
  create(data: Part.DTO, infos?: readonly Infos[]): Promise<Part.Model | null>;

  /**
   * Deletes a part from the database by its ID.
   * @param id - The unique identifier of the part.
   * @returns A promise resolving to the deleted part details or null if not found.
   */
  delete(id: string): Promise<Part.Model | null>;
}
