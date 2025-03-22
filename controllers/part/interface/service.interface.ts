import {
  CreationAttributes,
  DataTypes,
  Includeable,
  IncludeOptions,
  ModelStatic,
  Op,
  Sequelize,
} from "sequelize";
import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/info/Parts";
import { APIMapping } from "@/utils/interface/api";
import { FilterOptionsType } from "@/utils/interface/utils";
import { FilterOptions, DetailInfo as Options } from "@/utils/interface";
import { Infos, Products } from "@/utils/Enum";
import { Product } from "@/utils/interface/product";

type SearchOptions = {
  q?: string;
};

type PageOptions = APIMapping.PageOptions;

/**
 * A base service class for handling parts data.
 */
@Injectable()
abstract class BasePartService<
  Detail = Part.BasicInfo,
  Filter = Part.FilterOptions
> {
  /**
   * List all parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The list of parts that satisfy the filter options.
   */
  async list(
    options: FilterOptions & PageOptions & SearchOptions
  ): Promise<APIMapping.Payload<Detail>> {
    let { part } = options;

    const FilteredPart = PartInformation.scope([
      { method: [ModelScopes.SUMMARY, Part.SummaryAttributes] },
      { method: [ModelScopes.FILTER, part] },
    ]);

    const { rows, count } = await this.listFromPart(FilteredPart, options);

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  /**
   * Create a new {@link Filter} object that filters
   * the parts satisfying the given {@link Filter} options.
   * @param options The filter options to apply.
   * @returns The created filter object.
   */
  async filter(
    options: FilterOptions & PageOptions & SearchOptions,
    attributes?: string[]
  ): Promise<Filter> {
    const { filter } = await this.filterPart(options, attributes);

    return filter;
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
    const { page, limit } = options;
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
   * by getting each {@link attributes} values from the model
   * from the {@link model}. The result value is initial
   * set to the {@link initial} object.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param initial The initial value of the result object.
   * @param attributes The attributes to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created {@link FilterOptionsType} object.
   */
  protected async filterInfoModel<
    Info extends { [key in string]: any },
    Attributes extends keyof Info
  >(
    model: ModelStatic<any>,
    initial: FilterOptionsType<Info, Attributes>,
    options: PageOptions,
    attributes: Attributes[],
    ...include: IncludeOptions[]
  ): Promise<FilterOptionsType<Info, Attributes>> {
    const result: FilterOptionsType<Info, Attributes> = {};
    const promises = attributes.map(async (attr) => {
      if (initial[attr]) {
        result[attr] = initial[attr];
        return;
      }

      result[attr] = (await this.filterAttribute(
        model,
        options,
        attr.toString(),
        ...include
      )) as any;
    });

    await Promise.all(promises);

    return result;
  }

  /**
   * Create a new filter array of the {@link attribute}.
   * The result depends on the type of {@link attribute} in the {@link model}.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param attribute The attributes to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created filter array.
   */
  protected async filterAttribute<
    Info extends { [key in Attributes]: any },
    Attributes extends string
  >(
    model: ModelStatic<any>,
    options: PageOptions,
    attribute: Attributes,
    ...include: IncludeOptions[]
  ): Promise<
    NonNullable<FilterOptionsType<Info, Attributes>[typeof attribute]>
  > {
    include.forEach((val) => (val.attributes = []));

    const AttrType = model.getAttributes()[attribute].type;

    const result = await (AttrType instanceof DataTypes.NUMBER
      ? this.filterNumberAttribute(model, attribute, ...include)
      : this.filterStringAttribute(model, options, attribute, ...include));

    return result as NonNullable<
      FilterOptionsType<Info, Attributes>[typeof attribute]
    >;
  }

  /**
   * Create a new string filter array of the {@link attribute} in {@link model}.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param attribute The attribute to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created string array of the {@link attribute}.
   */
  protected async filterStringAttribute(
    model: ModelStatic<any>,
    options: PageOptions,
    attribute: string,
    ...include: IncludeOptions[]
  ): Promise<string[]> {
    const query = await model.findAll({
      attributes: [attribute.toString()],
      group: attribute.toString(),
      order: [attribute.toString()],
      include,
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
      raw: true,
      subQuery: false,
    });

    return query.map((value) => value[attribute]).filter((value) => value);
  }

  /**
   * Create a new number filter array of the {@link attribute} in {@link model}.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param attribute The attribute to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created number array of the {@link attribute}.
   */
  protected async filterNumberAttribute(
    model: ModelStatic<any>,
    attribute: string,
    ...include: IncludeOptions[]
  ): Promise<number[]> {
    const query = (await model.findOne({
      attributes: [
        [Sequelize.fn("min", Sequelize.col(attribute as string)), "min"],
        [Sequelize.fn("max", Sequelize.col(attribute as string)), "max"],
      ],
      include,
      raw: true,
    })) as { min: number; max: number };

    return [query.min, query.max];
  }

  /**
   * Create a new {@link Part.FilterOptions} object of the model
   * from the given {@link FilterOptions} object
   * by getting each {@link attributes} values from the model
   * from the {@link model}.
   * The {@link include} object is the mapping
   * between {@link Infos} and coresponding {@link Model}.
   * @param options The initial options to find.
   * @param attributes The list of attributes to find in model.
   * @param include The mapping of infos and models.
   * @returns The created part filter options.
   */
  protected async filterPart(
    options: FilterOptions & PageOptions,
    attributes?: string[],
    include?: { [key in Infos]?: ModelStatic<any> }
  ) {
    attributes = attributes ?? Part.FilterAttributes;

    const FilteredPart = PartInformation.scope({
      method: [ModelScopes.FILTER, options.part],
    });

    const FilteredInfos = Object.entries(include ?? {}).map(
      ([info, model]) => ({
        model,
        required: Boolean(options[info as Infos]),
      })
    );

    const result: Record<string, string[] | number[]> = {};
    const promises = attributes.map(async (attr) => {
      if (!Part.FilterAttributes.includes(attr as Part.Filterables)) return;

      const initial = options?.part && options.part[attr as Part.Filterables];
      if (initial) {
        result[attr] = initial;
        return;
      }

      result[attr] = await this.filterAttribute(
        FilteredPart,
        options,
        attr.toString(),
        ...FilteredInfos
      );
    });

    await Promise.all(promises);

    // Create filter option of the part model and the included info model
    return { model: FilteredPart, filter: result as Filter };
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
  Detail extends Part.BasicInfo,
  Filter = Part.FilterOptions
> extends BasePartService<Detail, Filter> {
  /**
   * Describe the part type that the service is handling.
   */
  abstract part: Products;

  async list(
    options: FilterOptions & PageOptions & SearchOptions
  ): Promise<APIMapping.Payload<Detail>> {
    const { part, ...rest } = options;

    const FilteredPart = PartInformation.scope([
      { method: [ModelScopes.SUMMARY, Part.SummaryAttributes] },
      { method: [ModelScopes.FILTER, { ...part, part: [this.part] }] },
    ]);

    const include: Includeable[] = Mapping.Info[this.part].map((info) => ({
      model: InfoModels[info].scope([
        {
          method: [
            ModelScopes.SUMMARY,
            Mapping.SummaryAttributeMapping[this.part][info],
          ],
        },
        { method: [ModelScopes.FILTER, rest[info]] },
      ]),
      required: Boolean(rest[info]),
    }));

    const { rows, count } = await this.listFromPart(
      FilteredPart,
      rest,
      ...include
    );

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  protected async filterPart(
    options: FilterOptions & PageOptions,
    attributes?: string[],
    include?: { [key in Infos]?: ModelStatic<any> }
  ) {
    options.part = { ...options.part, part: [this.part] };

    // Create filtered info models of the product infos using scope
    include = {};
    Product.Info[this.part].forEach(
      (info) =>
        (include[info] = InfoModels[info].scope({
          method: [ModelScopes.FILTER, options[info]],
        }))
    );

    // Create filter option of the part model and the included info model
    const { model, filter } = await super.filterPart(
      options,
      attributes,
      include
    );

    const productFilter = await this.filterProduct(
      include,
      options,
      attributes,
      model
    );

    return { model, filter: { ...filter, ...productFilter } as Filter };
  }

  protected async buildPart(
    options: Options,
    ...include: Includeable[]
  ): Promise<PartInformation | string> {
    const part = Part.Schema.partial().parse(options);
    const instance = await super.buildPart(
      { ...part, part: this.part },
      ...Product.Info[this.part].map((info) =>
        InfoModels[info].scope(ModelScopes.DETAIL)
      ),
      ...include
    );

    if (typeof instance === "string") return instance;

    await Promise.all(
      Product.Info[this.part].map((info) =>
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
      ...Product.Info[this.part].map((info) =>
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
      ...Product.Info[this.part].map((info) =>
        InfoModels[info].scope(ModelScopes.DETAIL)
      ),
      ...include
    );

    if (!instance || typeof instance === "string") return instance;

    await Promise.all(
      Product.Info[this.part].map((info) =>
        this.setDetailModel(instance, options, info)
      )
    );

    return instance;
  }

  protected async savePart(instance: PartInformation): Promise<void> {
    await instance.save();

    await Promise.all(
      Product.Info[this.part].map((info) => instance[info]?.save())
    );
  }

  /**
   * Create a new filter object of the {@link part}
   * from the given {@link FilterOptions} object
   * by getting each {@link attributes} values from the model
   * from the {@link infosModel} with {@link partModel} included.
   * @param options The initial options to find.
   * @param attributes The list of attributes to find in model.
   * @param include The mapping of infos and models.
   * @returns The created part filter options.
   */
  protected async filterProduct(
    infosModel: { [key in Infos]?: ModelStatic<any> },
    options: FilterOptions & PageOptions,
    attributes?: string[],
    partModel?: ModelStatic<PartInformation>
  ) {
    const result: Record<string, string[] | number[]> = {};

    attributes = attributes ?? Object.keys(Product.FilterMapping[this.part]);
    const infoPromise = attributes.map(async (key) => {
      if (!Product.FilterMapping[this.part][key]) return;

      const [info, attr] = Product.FilterMapping[this.part][key];
      const infoOptions = (options[info] ?? {}) as Record<
        string,
        string[] | number[] | undefined
      >;

      // Return early if already filtered
      if (infoOptions && infoOptions[attr]) {
        result[key] = infoOptions[attr];
        return;
      }

      const { [info]: model } = infosModel;
      if (!model) return;

      result[key] = await this.filterAttribute(model, options, attr, {
        model: partModel,
      });
    });

    await Promise.all(infoPromise);

    return result;
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
    info: Infos
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

export { BasePartService, BaseDetailPartService };
