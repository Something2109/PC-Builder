import { InferAttributes, Op, Sequelize, WhereOptions } from "sequelize";
import { PartInformation } from "@/models/parts/tables/Part";
import { Products } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Models, ModelFilters, IdSubQuery } from ".";
import { Tables } from "../interface";

class PartAccess {
  async list(options?: FilterOptions & PageOptions) {
    try {
      let { page, limit, part, ...detail } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      let include;
      if (part && part.part && part.part[0]) {
        include = {
          model: Models[part.part[0] as Products].scope("summary"),
          where: detail[part.part[0] as Products] ?? {},
        };
      }

      const { rows, count } = await PartInformation.scope([
        "summary",
        {
          method: ["filter", part],
        },
      ]).findAndCountAll({
        limit,
        offset: page * limit,
        include,
      });

      return { total: count, list: rows.map((value) => value.toJSON()) };
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  async search(str: string, options?: FilterOptions & PageOptions) {
    try {
      let { page, limit, part, ...detail } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      let include;
      if (part && part.part && part.part[0]) {
        include = {
          model: Models[part.part[0] as Products].scope("summary"),
          where: detail[part.part[0] as Products] ?? {},
        };
      }

      const { rows, count } = await PartInformation.scope([
        "summary",
        {
          method: ["filter", part],
        },
      ]).findAndCountAll({
        where: { name: { [Op.like]: `%${str}%` } },
        limit,
        offset: page * limit,
        include,
      });

      if (count) {
        return { total: count, list: rows.map((value) => value.toJSON()) };
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  async filter(options?: FilterOptions): Promise<FilterOptions | null> {
    try {
      const { part, ...detail } = options ?? {};
      const result: FilterOptions = {};

      const where: WhereOptions<InferAttributes<PartInformation>> = {
        part: part ?? Object.values(Products),
        ...part,
      };

      if (part && part.part && part.part[0]) {
        const subquery = IdSubQuery(
          Models[part.part[0] as Products].name,
          detail[part.part[0] as Products] ?? {}
        );
        where.id = [Sequelize.literal(subquery)];

        const partSubquery = IdSubQuery(Tables.PART, where);

        result[part.part[0] as Products] = (await ModelFilters[
          part.part[0] as Products
        ]({
          id: [Sequelize.literal(`(${partSubquery})`) as unknown as string],
          ...detail[part.part[0] as Products],
        })) as any;
      }

      result.part = await ModelFilters.part(where as any);

      return result;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  async get(
    part: Products,
    id: string
  ): Promise<DetailInfo<typeof part> | null> {
    try {
      const save = await PartInformation.scope("detail").findByPk(id, {
        include: {
          model: Models[part],
        },
      });

      if (save) {
        return save.toJSON() as unknown as DetailInfo<typeof part>;
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  }
}

type PageOptions = {
  page?: number;
  limit?: number;
};

export { PartAccess };
