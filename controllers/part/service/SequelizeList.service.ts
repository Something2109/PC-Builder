import {
  DatabaseListInterface,
  ModelAttributeList,
} from "../interface/database.interface";
import { PartInformation } from "@/models/parts";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Infos } from "@/utils/Enum";
import { Injectable } from "@nestjs/common";
import {
  col,
  DataTypes,
  Filterable,
  fn,
  IncludeOptions,
  ModelStatic,
  Op,
} from "sequelize";

@Injectable()
class SequelizeListService implements DatabaseListInterface {
  async list(
    options: Part.Filter & API.PageOptions & API.SearchOptions,
    attrs?: { [key in Infos]?: string[] }
  ) {
    const Context = new SequelizeContext(options, attrs);

    return await Context.list();
  }

  async filter(
    options: Part.Filter & API.PageOptions & API.SearchOptions,
    attrs: ModelAttributeList
  ): Promise<Part.Filter> {
    const { part, ...infos } = attrs;
    const Context = new SequelizeContext(options, infos);
    const filter: Part.Filter = {};

    const partPromises = part.map(async (attr) => {
      const value =
        options.part && options.part[attr]
          ? options.part[attr]
          : await Context.filter(attr);

      if (!filter.part) filter.part = {};
      filter.part[attr] = value as string[];
    });

    const infoPromises = Object.entries(infos).map(([key, attributes]) => {
      const info = key as Infos;
      return attributes.map(async (attribute) => {
        const value =
          options[info] && options[info][attribute]
            ? options[info][attribute]
            : await Context.filter(attribute, key as Infos);

        if (!filter[info]) filter[info] = {};
        filter[info][attribute] = value;
      });
    });

    await Promise.all([...partPromises, ...infoPromises.flat()]);

    return filter;
  }
}

type InfoModelContext = {
  [key in Infos]?: {
    model: ModelStatic<any>;
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
  private readonly searchOptions: Filterable;

  constructor(
    options: Part.Filter & API.PageOptions & API.SearchOptions,
    attrs?: { [key in Infos]?: string[] }
  ) {
    this.PartModel = PartInformation.scope({
      method: [ModelScopes.FILTER, options.part],
    });

    const where = options.q
      ? { name: { [Op.like]: `%${options.q}%` } }
      : undefined;
    this.searchOptions = { where };
    this.pageOptions = {
      offset: (options.page - 1) * options.limit,
      limit: options.limit,
    };

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
      ...this.searchOptions,
      ...this.pageOptions,
      attributes: ["id", ...Part.BasicSummaryAttributes],
      include,
      distinct: true, // prevent multiple id row count if the query returns more than 1 row for an id.
    });

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(attribute: string, info?: Infos) {
    const MainModel = info ? this.InfoModels[info]?.model : this.PartModel;
    if (!MainModel) return [];

    const infoIncludeOptions: IncludeOptions[] = Object.entries(this.InfoModels)
      .filter(([key]) => key !== info)
      .map(([_, { model, required }]) => ({ model, attributes: [], required }));

    const options: IncludeOptions[] = info
      ? [
          {
            model: this.PartModel,
            attributes: [],
            include: infoIncludeOptions,
            required: true,
          },
        ]
      : infoIncludeOptions;

    const AttrType = MainModel.getAttributes()[attribute];

    if (!AttrType)
      throw new Error(`No attribute named ${attribute} in ${MainModel.name}`);

    const result = await (AttrType instanceof DataTypes.NUMBER
      ? this.filterNumberAttribute(MainModel, attribute, ...options)
      : this.filterStringAttribute(MainModel, attribute, ...options));

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
    model: ModelStatic<any>,
    attribute: string,
    ...include: IncludeOptions[]
  ): Promise<string[]> {
    const query = await model.findAll({
      ...this.searchOptions,
      ...this.pageOptions,
      attributes: [attribute.toString()],
      group: attribute.toString(),
      order: [attribute.toString()],
      include,
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
      ...this.searchOptions,
      ...this.pageOptions,
      attributes: [
        [fn("min", col(attribute as string)), "min"],
        [fn("max", col(attribute as string)), "max"],
      ],
      include,
      raw: true,
    })) as { min: number; max: number };

    return [query.min, query.max];
  }
}

export { SequelizeListService };
