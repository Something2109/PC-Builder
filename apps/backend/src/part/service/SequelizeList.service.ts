import { Injectable } from "@nestjs/common";
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
} from "sequelize";

import { ModelScopes, defaultFilter } from "@/models/interface";
import { PartInformation } from "@/models/parts";
import * as API from "@pc-builder/shared/API";
import Part, { Infos } from "@pc-builder/shared/part";

import { DatabaseListInterface, ModelAttributeList } from "../interface/database.interface";

type ListOptions = Part.Filter & API.PageOptions & API.SearchOptions;

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
      const value = options.part?.[attr] ?? (await Context.filter(attr));
      filter.part ??= {};
      filter.part[attr] = value as string[];
    });

    const infoPromises = Object.entries(infos).map(([key, attributes]) => {
      const info = key as Infos;
      return attributes.map(async (attribute) => {
        const value = options[info]?.[attribute] ?? (await Context.filter(attribute, key as Infos));

        filter[info] ??= {};
        filter[info][attribute] = value;
      });
    });

    await Promise.all([...partPromises, ...infoPromises.flat()]);

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

  constructor(options: ListOptions, attrs?: { [key in Infos]?: string[] }) {
    this.q = options.q;
    this.partFilter = options.part;
    this.PartModel = PartInformation.scope({
      method: [ModelScopes.FILTER, options.part],
    });

    this.partWhere = this.createPartWhereOption(options.q);
    this.pageOptions = {
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
    };

    if (
      options.sort_key &&
      Part.BasicAttributes.options.includes(options.sort_key as Part.BasicAttributes)
    ) {
      const orderCol = filterToWhereMap[options.sort_key] || options.sort_key;
      this.orderOptions = [[orderCol, options.sort_order || "asc"]];
    }

    this.InfoModels = {};
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        const info = key as Infos;
        this.InfoModels[info] = {
          model: PartInformation.associations[info].target.scope({
            method: [ModelScopes.FILTER, options[info]],
          }),
          summary: value,
          required: Boolean(options[info]),
        };
      });
    }
  }

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

    const AttrType = MainModel.getAttributes()[attribute];

    if (!AttrType) throw new Error(`No attribute named ${attribute} in ${MainModel.name}`);

    const result = await (AttrType instanceof DataTypes.NUMBER
      ? this.filterNumberAttribute(MainModel, attribute, where, ...options)
      : this.filterStringAttribute(MainModel, attribute, where, ...options));

    return result;
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

    const query = (await model.findAll({
      where,
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
   * Create a new number filter array of the {@link attribute} in {@link model}.
   * The {@link include} list contains the models included in the query.
   * @param model The model to get the values from.
   * @param attribute The attribute to get the values from the model.
   * @param include The models to include in the query.
   * @returns The created number array of the {@link attribute}.
   */
  protected async filterNumberAttribute(
    model: ModelStatic<Model>,
    attribute: string,
    where: WhereOptions | undefined,
    ...include: IncludeOptions[]
  ): Promise<number[]> {
    const attrExpr = filterToWhereMap[attribute] || col(`${model.name}.${attribute}`);

    const query = (await model.findOne({
      where,
      ...this.pageOptions,
      attributes: [
        [fn("min", attrExpr), "min"],
        [fn("max", attrExpr), "max"],
      ],
      include,
      raw: true,
    })) as unknown as { min: number; max: number } | null;

    return query ? [query.min, query.max] : [0, 0];
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
