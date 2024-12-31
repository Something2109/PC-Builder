import {
  CreationAttributes,
  Includeable,
  Model,
  ModelStatic,
  Op,
} from "sequelize";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import { FilterOptionsType } from "@/utils/interface/utils";

type DefaultService = "default";

type ListResult<Part> = {
  total: number;
  list: Part[];
};

type SearchOptions = {
  q?: string;
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
  abstract list(
    options?: Filter & PageOptions & SearchOptions
  ): Promise<ListResult<Detail>>;

  /**
   * Create a new {@link Filter} object that filters
   * the parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The created filter object.
   */
  abstract filter(options?: Filter & SearchOptions): Promise<Filter>;

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
   * List the parts from the given static {@link Model} instance of {@link PartInformation}
   * with the given page and search {@link options}.
   * @param Model The model to list the parts from.
   * @param options The page and search options to apply. Insert an empty object if none given.
   * @param include The include options to include in the query.
   * @returns The list of parts from the model and the total number.
   */
  protected async listFromPart(
    Model: ModelStatic<PartInformation>,
    options: PageOptions & SearchOptions,
    ...include: Includeable[]
  ): Promise<{ rows: PartInformation[]; count: number }> {
    const { page = 0, limit = 50 } = options ?? {};
    const where = options?.q
      ? { name: { [Op.like]: `%${options.q}%` } }
      : undefined;

    return await Model.findAndCountAll({
      where,
      limit,
      offset: page * limit,
      include,
    });
  }

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
  protected async filterFromModel<
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
   * Create the model instance of {@link model} with the given {@link data}.
   * If the {@link id} is provided, update the id instance with the new data
   * or create a new one if cant find.
   * The {@link model} must have the id field as attribute to update.
   * @param model The model to create the instance with.
   * @param data The data to create the instance with.
   * @param id The ID of the instance to update.
   * @returns The created or updated instance.
   */
  protected async setToModel<T extends Model<any, any>>(
    model: ModelStatic<T>,
    data: CreationAttributes<T>,
    id?: string
  ): Promise<T> {
    const [instance, created] = await model.findOrBuild({
      where: { id } as any, // add any type because the generic type does not contain the id field.
      defaults: data,
    });
    if (!created) instance.set(data);
    await instance.save();

    return instance;
  }

  /**
   * Retrieve the part with the given ID from the part model.
   * Validate the part with the class {@link part} whether it matches the part type.
   * If not return null.
   * @param model The part model to retrieve the part from.
   * @param id The ID of the part to retrieve.
   * @param include The include options to include in the query.
   * @returns The part with the given ID, or `null` if the part does not exist.
   */
  protected async getFromPart(
    model: ModelStatic<PartInformation>,
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | null> {
    const instance = await model.findByPk(id, { include });

    if (!instance || instance.part !== this.part) {
      return null;
    }

    return instance;
  }

  /**
   * A specific implementation of the {@link setToModel} function
   * for creating and updating the part with the given ID from the part model.
   * Validate the part with the class {@link part} whether it matches the part type.
   * If not throw a bad request exception.
   * @param model The part model to set the part to.
   * @param data The data to set the part with.
   * @param id The ID of the part to set.
   * @returns The created or updated part.
   */
  protected async setToPart(
    { part, ...data }: CreationAttributes<PartInformation>,
    id?: string
  ): Promise<PartInformation> {
    if (part && part !== this.part) {
      throw new BadRequestException(
        `Attempting to change part type to ${part} in ${this.part} controller.`
      );
    }

    const [instance, created] = await PartInformation.findOrBuild({
      where: { id } as any, // add any type because the generic type does not contain the id field.
      defaults: data,
    });

    if (instance.part !== this.part) {
      throw new BadRequestException(
        `Attempting to create or update ${instance.part} in ${this.part} page.`
      );
    }

    if (!created) instance.set(data);
    await instance.save();

    return instance;
  }

  /**
   * Delete the part with the given ID from the part model.
   * Validate the part with the class {@link part} whether it matches the part type.
   * If not return null.
   * Disclaimer: The include models are not actually deleted directly in the function,
   * but the instance is deleted by the database on delete cascade option.
   * If it's not set, the include models are not deleted and must be deleted manually.
   * @param model The part model to delete the part from.
   * @param id The ID of the part to delete.
   * @param include The include options to include in the query.
   * @returns The deleted part, or `null` if the part does not exist.
   */
  protected async deleteFromPart(
    model: ModelStatic<PartInformation>,
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | null> {
    const instance = await model.findByPk(id, { include });

    if (!instance || instance.part !== this.part) {
      return null;
    }

    await instance.destroy();
    return instance;
  }
}

export { BasePartService, type PageOptions, type SearchOptions };
