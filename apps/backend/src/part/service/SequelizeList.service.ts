import { Injectable } from "@nestjs/common";
import * as API from "@pc-builder/shared/API";
import Part, { Infos } from "@pc-builder/shared/part";
import {
  col,
  DataTypes,
  fn,
  IncludeOptions,
  Model,
  ModelStatic,
  Op,
  Order,
  WhereOptions,
  where as sequelizeWhere,
} from "sequelize";

import { ModelScopes, defaultFilter } from "@/models/interface";
import { PartInformation } from "@/models/parts";

import { DatabaseListInterface, ModelAttributeList } from "../interface/database.interface";

type ListOptions = Part.Filter & API.PageOptions & API.SearchOptions & { filter_q?: string };

const filterToWhereMap: Record<string, ReturnType<typeof col>> = {
  brand: col("brandRelation.name"),
  series: col("seriesRelation.name"),
};

@Injectable()
class SequelizeListService implements DatabaseListInterface {
  async list(options: ListOptions, attrs?: { [key in Infos]?: string[] }) {
    const Context = new SequelizeContext(options, attrs);

    return await Context.list();
  }

  async filter(options: ListOptions, attrs: ModelAttributeList): Promise<Part.Filter> {
    const { part, ...infos } = attrs;
    const Context = new SequelizeContext(options, infos);
    const filter: Part.Filter = {};

    const partPromises = part.map(async (attr) => {
      const value =
        attr === "brand" || attr === "series"
          ? await Context.filter(attr)
          : (options.part?.[attr] ?? (await Context.filter(attr)));
      filter.part ??= {};
      filter.part[attr] = value as any;
    });

    const infoPromises = Object.entries(infos).map(async ([key, attributes]) => {
      const info = key as Infos;
      const model = PartInformation.associations[info].target;
      const attributesDefinition = model.getAttributes();

      // Separate numeric ranges from discrete values
      const numericAttrs = attributes.filter((attr) => {
        const type = attributesDefinition[attr];
        return type && type.type instanceof DataTypes.NUMBER;
      });
      const discreteAttrs = attributes.filter((attr) => {
        const type = attributesDefinition[attr];
        return !type || !(type.type instanceof DataTypes.NUMBER);
      });

      const promises: Promise<void>[] = [];

      // A. Consolidate range queries for this table into a single SELECT query
      if (numericAttrs.length > 0) {
        promises.push(
          Context.filterNumbersForInfo(info, numericAttrs).then((ranges) => {
            filter[info] ??= {};
            Object.entries(ranges).forEach(([attr, val]) => {
              filter[info]![attr] = val as any;
            });
          })
        );
      }

      // B. Resolve discrete attributes (like socket)
      discreteAttrs.forEach((attribute) => {
        promises.push(
          Promise.resolve(options[info]?.[attribute] ?? Context.filter(attribute, info)).then(
            (value) => {
              filter[info] ??= {};
              filter[info]![attribute] = value as any;
            }
          )
        );
      });

      await Promise.all(promises);
    });

    await Promise.all([...partPromises, ...infoPromises]);

    return filter;
  }
}

type InfoModelContext = {
  [key in Infos]?: {
    model: ModelStatic<Model>;
    summary: string[];
    required: boolean;
  };
};

/**
 * The context object for adding filter scopes to the model
 * from the filter options for reusing it across all the list or filter
 * function call in a request.
 */
class SequelizeContext {
  private readonly PartModel: ModelStatic<PartInformation>;
  private readonly InfoModels: InfoModelContext;
  private readonly pageOptions: { limit: number; offset: number };
  private readonly orderOptions?: Order;
  private readonly partWhere?: WhereOptions<PartInformation>;
  private readonly partFilter?: Part.Filter["part"];
  private readonly q?: string;
  private readonly filter_q?: string;

  /**
   * Initializes a new instance of the SequelizeContext class.
   * Sets up query parameters, maps pagination/sorting, and initializes scoped sub-specification joins.
   *
   * @param options - The list, search, and filter options.
   * @param attrs - (Optional) List of specification sub-model attributes to query.
   */
  constructor(options: ListOptions, attrs?: { [key in Infos]?: string[] }) {
    this.q = options.q;
    this.filter_q = options.filter_q;
    this.partFilter = options.part;
    this.PartModel = PartInformation.scope({
      method: [ModelScopes.FILTER, options.part],
    });

    this.partWhere = this.createPartWhereOption(options.q);
    this.pageOptions = this.buildPageOptions(options);
    this.orderOptions = this.buildOrderOptions(options);
    this.InfoModels = this.initializeInfoModels(options, attrs);
  }

  /**
   * Translates query page and limit parameters into database offset and limit options.
   *
   * @param options - The list and query parameters.
   * @returns An object containing database offset and limit values.
   */
  private buildPageOptions(options: ListOptions) {
    return {
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
    };
  }

  /**
   * Builds the Sequelize Order configuration for sorting attributes.
   *
   * @param options - The list and query parameters.
   * @returns The Order array configuration, or undefined if no valid sorting parameters are provided.
   */
  private buildOrderOptions(options: ListOptions): Order | undefined {
    if (
      options.sort_key &&
      Part.BasicAttributes.options.includes(options.sort_key as Part.BasicAttributes)
    ) {
      const orderCol = filterToWhereMap[options.sort_key] || options.sort_key;
      return [[orderCol, options.sort_order || "asc"]];
    }
    return undefined;
  }

  /**
   * Dynamically maps sub-specification models and applies active filter scope methods.
   * Automatically sets the joins as required (INNER JOIN) if they contain active filters.
   *
   * @param options - The list and query parameters.
   * @param attrs - The mapped list of specification target attributes.
   * @returns The compiled InfoModelContext.
   */
  private initializeInfoModels(
    options: ListOptions,
    attrs?: { [key in Infos]?: string[] }
  ): InfoModelContext {
    const infoModels: InfoModelContext = {};
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        const info = key as Infos;
        infoModels[info] = {
          model: PartInformation.associations[info].target.scope({
            method: [ModelScopes.FILTER, options[info]],
          }),
          summary: value,
          required: Boolean(options[info]),
        };
      });
    }
    return infoModels;
  }

  /**
   * Queries and compiles a paginated list of part records matching the current active criteria.
   * Joins required specification tables and projects only the selected summary columns.
   *
   * @returns A promise resolving to a paginated list payload (containing count and items array).
   */
  async list() {
    const include: IncludeOptions[] = this.InfoModels
      ? Object.values(this.InfoModels)
          .filter(({ summary }) => summary)
          .map(({ model, summary, required }) => ({
            model,
            attributes: ["id", ...summary],
            required,
          }))
      : [];

    const { count, rows } = await this.PartModel.findAndCountAll({
      where: this.partWhere,
      ...this.pageOptions,
      order: this.orderOptions,
      include,
      distinct: true, // prevent multiple id row count if the query returns more than 1 row for an id.
      col: include.length === 0 ? `${this.PartModel.tableName}.id` : undefined,
    });

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  /**
   * Retrieves unique filter options available for a specific attribute from the database.
   * Isolates the target attribute to prevent self-filtering (excluding its own constraint from active parameters).
   *
   * @param attribute - The name of the target column/attribute.
   * @param info - (Optional) The specification sub-model namespace if the attribute lives in a spec table.
   * @returns A promise resolving to the list of available filter options (strings, numbers, or relations).
   */
  async filter(attribute: string, info?: Infos) {
    const cleanPartModel = PartInformation.unscoped();

    const MainModel = info ? this.InfoModels[info]?.model : cleanPartModel;
    if (!MainModel) return [];

    const infoIncludeOptions: IncludeOptions[] = Object.entries(this.InfoModels)
      .filter(([key]) => key !== info)
      .map(([_, { model, required }]) => ({ model, attributes: [], required }));

    const brandInclude = {
      model: PartInformation.associations.brandRelation.target,
      attributes: [],
      required: false,
    };
    const seriesInclude = {
      model: PartInformation.associations.seriesRelation.target,
      attributes: [],
      required: false,
    };

    let where: WhereOptions<PartInformation> | undefined = undefined;
    let options: IncludeOptions[] = [];

    if (info) {
      where = this.createPartWhereOption(this.q, "part.");
      options = [
        {
          model: cleanPartModel,
          attributes: [],
          required: true,
          where: defaultFilter(this.partFilter),
          include: [
            brandInclude,
            seriesInclude,
            ...infoIncludeOptions.map((inc) => ({ ...inc, attributes: [] })),
          ],
        },
      ];
    } else {
      where = {
        [Op.and]: [this.createPartWhereOption(this.q, ""), defaultFilter(this.partFilter)].filter(
          Boolean
        ) as WhereOptions<PartInformation>[],
      };
      options = [
        brandInclude,
        seriesInclude,
        ...infoIncludeOptions.map((inc) => ({ ...inc, attributes: [] })),
      ];
    }

    if (attribute === "brand" || attribute === "series") {
      return await this.filterRelationAttribute(MainModel, attribute, where, options);
    }

    const AttrType = MainModel.getAttributes()[attribute];

    if (!AttrType) throw new Error(`No attribute named ${attribute} in ${MainModel.name}`);

    if (AttrType.type instanceof DataTypes.NUMBER) {
      const numberRes = await this.filterNumbers(MainModel, [attribute], where, ...options);
      return numberRes[attribute] ?? [0, 0];
    }

    const result = await this.filterStringAttribute(MainModel, attribute, where, ...options);

    return result;
  }

  /**
   * Create a new relation filter array of the {@link attribute} in {@link model}.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param attribute The attribute (brand/series) to filter relation for.
   * @param where The where query conditions.
   * @param include The models to include in the query.
   * @returns The created array of objects containing id and name.
   */
  protected async filterRelationAttribute(
    model: ModelStatic<Model>,
    attribute: string,
    where: WhereOptions | undefined,
    include: IncludeOptions[]
  ): Promise<{ id: number; name: string }[]> {
    const associationKey = `${attribute}Relation`;
    const association = PartInformation.associations[associationKey];
    if (!association) {
      throw new Error(`Relation association for ${attribute} not found on PartInformation`);
    }
    const relationName = associationKey;
    const relationModel = association.target;

    const queryInclude = include.map((inc) => {
      if (inc.model === relationModel) {
        return {
          ...inc,
          attributes: ["id", "name"],
          required: true,
        };
      }
      return inc;
    });

    const idExpr = col(`${relationName}.id`);
    const nameExpr = col(`${relationName}.name`);

    let queryWhere = where;
    if (this.filter_q) {
      queryWhere = {
        [Op.and]: [where, sequelizeWhere(nameExpr, { [Op.like]: `%${this.filter_q}%` })].filter(
          Boolean
        ) as WhereOptions[],
      };
    }

    const query = (await model.findAll({
      where: queryWhere,
      ...this.pageOptions,
      attributes: [
        [idExpr, "id"],
        [nameExpr, "name"],
      ],
      group: [idExpr, nameExpr],
      order: [nameExpr],
      include: queryInclude,
      raw: true,
      subQuery: false,
    })) as unknown as Record<string, any>[];

    return query
      .map((value) => ({
        id: Number(value[`${relationName}.id`] ?? value.id),
        name: String(value[`${relationName}.name`] ?? value.name),
      }))
      .filter((item) => item.id && item.name);
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
    model: ModelStatic<Model>,
    attribute: string,
    where: WhereOptions | undefined,
    ...include: IncludeOptions[]
  ): Promise<string[]> {
    const attrExpr = filterToWhereMap[attribute] || col(`${model.name}.${attribute}`);

    let queryWhere = where;
    if (this.filter_q) {
      queryWhere = {
        [Op.and]: [where, sequelizeWhere(attrExpr, { [Op.like]: `%${this.filter_q}%` })].filter(
          Boolean
        ) as WhereOptions[],
      };
    }

    const query = (await model.findAll({
      where: queryWhere,
      ...this.pageOptions,
      attributes: [[attrExpr, attribute]],
      group: [attrExpr],
      order: [attrExpr],
      include,
      raw: true,
      subQuery: false,
    })) as unknown as Record<string, any>[];

    return query.map((value) => value[attribute]).filter(Boolean);
  }

  /**
   * Consolidates numeric range queries for a given sub-specification model, applying anti-self-filtering.
   *
   * @param info - The sub-specification model name.
   * @param attributes - List of numeric attribute names in the spec model.
   * @returns A promise resolving to a record mapping each attribute to its calculated [min, max] range.
   */
  async filterNumbersForInfo(info: Infos, attributes: string[]): Promise<Record<string, number[]>> {
    const cleanPartModel = PartInformation.unscoped();
    const MainModel = this.InfoModels[info]?.model;
    if (!MainModel || attributes.length === 0) return {};

    const infoIncludeOptions: IncludeOptions[] = Object.entries(this.InfoModels)
      .filter(([key]) => key !== info)
      .map(([_, { model, required }]) => ({ model, attributes: [], required }));

    const brandInclude = {
      model: PartInformation.associations.brandRelation.target,
      attributes: [],
      required: false,
    };
    const seriesInclude = {
      model: PartInformation.associations.seriesRelation.target,
      attributes: [],
      required: false,
    };

    const where = this.createPartWhereOption(this.q, "part.");
    const options = [
      {
        model: cleanPartModel,
        attributes: [],
        required: true,
        where: defaultFilter(this.partFilter),
        include: [
          brandInclude,
          seriesInclude,
          ...infoIncludeOptions.map((inc) => ({ ...inc, attributes: [] })),
        ],
      },
    ];

    return await this.filterNumbers(MainModel, attributes, where, ...options);
  }

  /**
   * Calculates the minimum and maximum ranges for a list of numeric attributes in a single database query.
   *
   * @param model - The model containing the numeric attributes.
   * @param attributes - An array of numeric attribute names.
   * @param where - Query constraints.
   * @param include - Related models to include.
   * @returns A promise resolving to a record mapping each attribute to its [min, max] range.
   */
  protected async filterNumbers(
    model: ModelStatic<Model>,
    attributes: string[],
    where: WhereOptions | undefined,
    ...include: IncludeOptions[]
  ): Promise<Record<string, number[]>> {
    if (attributes.length === 0) return {};

    const selectAttributes: any[] = [];
    attributes.forEach((attr) => {
      const attrExpr = filterToWhereMap[attr] || col(`${model.name}.${attr}`);
      selectAttributes.push([fn("min", attrExpr), `${attr}_min`]);
      selectAttributes.push([fn("max", attrExpr), `${attr}_max`]);
    });

    const query = (await model.findAll({
      where,
      attributes: selectAttributes,
      include,
      raw: true,
      subQuery: false,
    })) as unknown as Record<string, any>[];

    const rawRanges = query[0] || null;

    const result: Record<string, number[]> = {};
    attributes.forEach((attr) => {
      result[attr] =
        rawRanges && rawRanges[`${attr}_min`] !== null && rawRanges[`${attr}_max`] !== null
          ? [Number(rawRanges[`${attr}_min`]), Number(rawRanges[`${attr}_max`])]
          : [0, 0];
    });

    return result;
  }

  /**
   * Create the search options for the where parameters.
   * @param query The query string to search.
   * @returns The option for the query.
   */
  protected createPartWhereOption(
    query?: string,
    prefix: string = ""
  ): WhereOptions<PartInformation> | undefined {
    if (!query) return undefined;

    const nameKey = prefix ? `$${prefix}name$` : "name";
    const codeNameKey = prefix ? `$${prefix}code_name$` : "code_name";
    const brandKey = `$${prefix}brandRelation.name$`;
    const seriesKey = `$${prefix}seriesRelation.name$`;

    const where = {
      [Op.or]: {
        [nameKey]: { [Op.like]: `%${query}%` },
        [codeNameKey]: { [Op.like]: `${query}%` },
        [brandKey]: { [Op.like]: `%${query}%` },
        [seriesKey]: { [Op.like]: `%${query}%` },
      },
    };

    return where;
  }
}

export { SequelizeListService };
