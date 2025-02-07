import { CreationAttributes, Includeable, ModelStatic, Op } from "sequelize";
import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { InfoModels } from "@/models/parts";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/info/Parts";
import { APIMapping } from "@/utils/interface/api";
import { FilterOptionsType, Primitive } from "@/utils/interface/utils";
import {
  FilterOptions as Filter,
  DetailInfo as Options,
  FilterAttributes,
  ProductInfo,
} from "@/utils/interface";
import { Info, Products } from "@/utils/Enum";
import { ZodSchema } from "zod";

type SearchOptions = {
  q?: string;
};

type PageOptions = {
  page: number;
  limit: number;
};

/**
 * A base service class for handling parts data.
 */
@Injectable()
abstract class BasePartService<Detail = Part.BasicInfo> {
  /**
   * List all parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The list of parts that satisfy the filter options.
   */
  abstract list(
    options: Filter & PageOptions & SearchOptions
  ): Promise<APIMapping.Payload<Detail>>;

  /**
   * Create a new {@link Filter} object that filters
   * the parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The created filter object.
   */
  abstract filter(options: Filter & SearchOptions): Promise<Filter>;

  /**
   * Create the option to pass into the {@link list} and {@link filter} functions
   * from an object of string or string array value
   * (the object parsed from the {@link URLSearchParams} using Nest Query decorator).
   * @param params The object of string key and string/string array value.
   * @returns The option parsed from the {@link params}.
   */
  options(
    params: Record<string, string | string[]>
  ): Filter & PageOptions & SearchOptions {
    const result: Filter & PageOptions & SearchOptions = {
      page: 1,
      limit: 50,
    };

    if (params.q) {
      result.q = Array.isArray(params.q) ? params.q.join("|") : params.q;
    }

    const page = Number(
      Array.isArray(params.page) ? params.page[0] : params.page
    );
    result.page = page > 0 ? page : 1;

    const limit = Number(
      Array.isArray(params.limit) ? params.limit[0] : params.limit
    );
    result.limit = limit > 0 ? limit : 50;

    return result;
  }

  /**
   * Create a new part with the given {@link Options} data.
   * If the part's code name is already exists, return the part's ID.
   * @param data The data to create the part with.
   * @returns The created part or the part's id.
   */
  async create(data: Options): Promise<Detail | string> {
    {
      const instance = await this.buildPart(data);
      if (typeof instance === "string") return instance;

      await this.savePart(instance);

      return instance.toJSON();
    }
  }

  /**
   * Retrieve the part with the given ID.
   * @param id The ID of the part to retrieve.
   * @returns The part with the given ID, or `null` if the part does not exist.
   */
  async get(id: string): Promise<Detail | null> {
    const instance = await this.getPart(id);

    return instance?.toJSON() ?? null;
  }

  /**
   * Create a new part with the given {@link Options} data.
   * If the part's new code name's already exists, return the part's ID.
   * If the part with the given ID does not exist, return `null`.
   * (Must provide a valid {@link id} to update the part).
   * @param data The data to create the part with.
   * @param id The ID of the part to update.
   * @returns The updated part or the part's id or null.
   */
  async set(data: Options, id: string): Promise<Detail | string | null> {
    const instance = await this.setPart(data, id);
    if (!instance || typeof instance === "string") return instance;

    await this.savePart(instance);

    return instance.toJSON();
  }

  /**
   * Delete the part with the given ID.
   * @param id The ID of the part to delete.
   * @returns The deleted part, or `null` if the part does not exist.
   */
  async delete(id: string): Promise<Detail | null> {
    const instance = await this.getPart(id);
    if (!instance) return null;

    await instance.destroy();

    return instance.toJSON();
  }

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
    const { page = 1, limit = 50 } = options ?? {};
    const where = options?.q
      ? { name: { [Op.like]: `%${options.q}%` } }
      : undefined;

    return await Model.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      include,
      distinct: true, // prevent multiple id row count if the query returns more than 1 row for an id.
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
      if (result[attr]) {
        continue;
      }

      const query = await model.findAll({
        attributes: [attr.toString()],
        group: attr.toString(),
        order: [attr.toString()],
        include: include.map((value) => ({ model: value, attributes: [] })),
        raw: true,
      });

      result[attr] = query.map((value) => value[attr]).filter((value) => value);
    }

    return result;
  }

  /**
   * Create a new part with the given {@link data}.
   * If the part with the given code name already exists,
   * return null.
   * This function does not save the part to the database.
   * @param data The data to create the part with.
   * @param include The include options to include in the query.
   * @returns The created part or `null` if the part's already exist.
   */
  protected async buildPart(
    data: CreationAttributes<PartInformation>,
    ...include: Includeable[]
  ): Promise<PartInformation | string> {
    const where = data.code_name ? { code_name: data.code_name } : undefined;

    const [instance, created] = await PartInformation.findOrBuild({
      where,
      include,
      defaults: data,
    });
    if (!created) return instance.id;

    return instance;
  }

  /**
   * Retrieve the part with the given ID from the part model.
   * @param model The part model to retrieve the part from.
   * @param id The ID of the part to retrieve.
   * @param include The include options to include in the query.
   * @returns The part with the given ID, or `null` if the part does not exist.
   */
  protected async getPart(
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | null> {
    const instance = await PartInformation.scope(ModelScopes.DETAIL).findByPk(
      id,
      { include }
    );

    return instance;
  }

  /**
   * Update the part with the {@link id} with the given {@link data}.
   * If the part with the given code name already exists or the part not found,
   * return null.
   * This function does not save the part to the database.
   * @param data The data to set the part with.
   * @param id The ID of the part to set.
   * @param include The include options to include in the query.
   * @returns The created or updated part.
   */
  protected async setPart(
    { part, ...data }: CreationAttributes<PartInformation>,
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | string | null> {
    let instance: PartInformation | null = null;
    if (data.code_name) {
      instance = await PartInformation.scope(ModelScopes.DETAIL).findOne({
        where: { code_name: data.code_name },
        include,
      });
      if (instance && instance.id !== id) return instance.id;
    }

    instance = instance || (await this.getPart(id, ...include));
    if (!instance) return null;

    instance.set(data);
    if (!instance.part) instance.part = part;

    return instance;
  }

  /**
   * Save the part instance to the database.
   * @param instance The instance to save.
   */
  protected async savePart(instance: PartInformation): Promise<void> {
    await instance.save();
  }
}

/**
 * A base service class for handling parts data with detail information.
 * The service automatically handles the part type and the detail type
 * given the part model exists in the {@link InfoModels} object.
 * To define clearer logic, extends this class and override the methods.
 * @extends BasePartService
 */
abstract class BaseDetailPartService<
  Detail extends Part.BasicInfo
> extends BasePartService<Detail> {
  /**
   * Describe the part type that the service is handling.
   */
  abstract part: Products;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result.part = {};

    const options = result.part;
    this.parse(params, Primitive.String, options, "part");
    this.parse(params, Primitive.String, options, "brand");
    this.parse(params, Primitive.String, options, "series");

    return result;
  }

  async list(
    options: Filter & PageOptions & SearchOptions
  ): Promise<APIMapping.Payload<Detail>> {
    const { part, ...rest } = options;

    const FilteredPart = PartInformation.scope({
      method: [ModelScopes.SUMMARY, { ...part, part: [this.part] }],
    });

    const include: Includeable[] = ProductInfo[this.part].map((info) => ({
      model: InfoModels[info].scope({
        method: [ModelScopes.SUMMARY, rest[info]],
      }),
      required: Boolean(rest[info]),
    }));

    const { rows, count } = await this.listFromPart(
      FilteredPart,
      rest,
      ...include
    );

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(options: Filter & SearchOptions): Promise<Filter> {
    const part = { ...options.part, part: [this.part] };

    const FilteredInfos = ProductInfo[this.part].map((info) =>
      InfoModels[info].scope({ method: [ModelScopes.FILTER, options[info]] })
    );
    const FilteredPart = PartInformation.scope({
      method: [ModelScopes.FILTER, part],
    });

    const result: Filter = {
      part: await this.filterFromModel(
        FilteredPart,
        part,
        Part.FilterAttributes,
        ...FilteredInfos
      ),
    };

    const infoPromise = FilteredInfos.map(async (model, index) => {
      const info = ProductInfo[this.part][index];

      let filter: any = null;
      if (options[info] !== null) {
        filter = await this.filterFromModel(
          model,
          (options[info] as any) ?? {},
          FilterAttributes[info],
          FilteredPart
        );
      }

      result[info] = filter;
    });

    await Promise.all(infoPromise);

    return result;
  }

  /**
   * Extract the {@link key} properties from the {@link params} parameter
   * and parse it with the {@link schema}. Then save it in the {@link dest} object
   * using the {@link key} string.
   * @param params The parameters to extract the key from.
   * @param schema The schema to validate and parse the key values.
   * @param dest The destination object to store the parsed values.
   * @param key The key to extract and parse from the params.
   */
  protected parse<Key extends string, Value>(
    params: Record<string, string | string[]>,
    schema: ZodSchema<Value>,
    dest: { [key in Key]?: Value[] },
    key: Key
  ) {
    let option = params[key];

    if (!option) return;

    if (!Array.isArray(option)) option = [option];

    const parsedOption = option
      .map((val) => schema.safeParse(val))
      .filter((val) => val.success)
      .map((val) => val.data);

    if (parsedOption.length > 0) {
      dest[key] = parsedOption;
    }
  }

  protected async buildPart(
    options: Options,
    ...include: Includeable[]
  ): Promise<PartInformation | string> {
    const part = Part.Schema.partial().parse(options);
    const instance = await super.buildPart(
      { ...part, part: this.part },
      ...ProductInfo[this.part].map((info) =>
        InfoModels[info].scope(ModelScopes.DETAIL)
      ),
      ...include
    );

    if (typeof instance === "string") return instance;

    await Promise.all(
      ProductInfo[this.part].map((info) =>
        this.setDetailModel(instance, options, info)
      )
    );

    return instance;
  }

  protected async getPart(
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | null> {
    const instance = await super.getPart(
      id,
      ...ProductInfo[this.part].map((info) =>
        InfoModels[info].scope(ModelScopes.DETAIL)
      ),
      ...include
    );

    if (!instance || instance.part !== this.part) return null;

    return instance;
  }

  protected async setPart(
    options: Options,
    id: string,
    ...include: Includeable[]
  ): Promise<PartInformation | string | null> {
    const part = Part.Schema.partial().parse(options);
    const instance = await super.setPart(
      { ...part, part: this.part },
      id,
      ...ProductInfo[this.part].map((info) =>
        InfoModels[info].scope(ModelScopes.DETAIL)
      ),
      ...include
    );

    if (!instance || typeof instance === "string") return instance;

    await Promise.all(
      ProductInfo[this.part].map((info) =>
        this.setDetailModel(instance, options, info)
      )
    );

    return instance;
  }

  protected async savePart(instance: PartInformation): Promise<void> {
    await instance.save();

    await Promise.all(
      ProductInfo[this.part].map((info) => instance[info]?.save())
    );
  }

  /**
   * Extract the options of {@link info} from the {@link data} and set it
   * to the corresponding {@link info} of the {@link instance}.
   * If the options is null, destroy the part instance.
   * The options will only destroy the detail instance in the database
   * but not save the instance if it gets created or updated.
   * @param instance The instance to set the detail to.
   * @param data The data to extract the detail from.
   * @param info The part to set the detail to.
   */
  protected async setDetailModel(
    instance: PartInformation,
    data: Options,
    info: Info
  ): Promise<void> {
    const options = data[info];

    if (options === null && instance[info]) {
      await instance[info].destroy();
      instance[info] = null as any;
      instance.dataValues[info] = null;
    }

    if (options) {
      if (!instance[info]) {
        instance[info] = InfoModels[info].build({
          id: instance.id,
        }) as never;
        instance.dataValues[info] = instance[info];
      }
      instance[info].set(options);
    }
  }
}

export {
  BasePartService,
  BaseDetailPartService,
  type PageOptions,
  type SearchOptions,
};
