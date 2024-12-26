import { InferAttributes, Op, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Injectable } from "@nestjs/common";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { PartInformation } from "@/models/parts/tables/Part";
import { Products } from "@/utils/Enum";
import { ModelFilters, Models } from "@/models/parts";
import { Tables } from "@/models/interface";

@Injectable()
class PartService {
  constructor(private Connection: Sequelize) {}

  async list(options?: FilterOptions & PageOptions) {
    let { page, limit, part, ...detail } = options ?? {};
    page = (page ?? 1) - 1;
    limit = limit ?? Number(process.env.PageSize ?? 50);

    let include;
    if (part && part.part && part.part[0]) {
      include = {
        model: Models[part.part[0] as Products].scope("summary"),
        where: detail[part.part[0] as Products] ?? {},
        required: false,
      };
    }

    const { rows, count } = await PartInformation.scope([
      "summary",
      { method: ["filter", part] },
    ]).findAndCountAll({
      limit,
      offset: page * limit,
      include,
    });

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async search(str: string, options?: FilterOptions & PageOptions) {
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

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(options?: FilterOptions): Promise<FilterOptions | null> {
    try {
      const { part, ...detail } = options ?? {};
      const result: FilterOptions = {};

      const where: WhereOptions<InferAttributes<PartInformation>> = {
        part: part?.part ?? Object.values(Products),
        ...part,
      };

      const ProductName =
        part && part.part ? (part.part[0] as Products) : undefined;
      if (ProductName) {
        const subquery = this.IdSubQuery(
          Models[ProductName].name,
          detail[ProductName] ?? {}
        );
        where.id = [Sequelize.literal(subquery)];

        const partSubquery = this.IdSubQuery(Tables.PART, where);

        result[ProductName] = (await ModelFilters[ProductName]({
          id: [Sequelize.literal(`(${partSubquery})`)],
          ...(detail[ProductName] as any),
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
    const save = await PartInformation.scope("detail").findByPk(id, {
      include: {
        model: Models[part],
      },
    });

    if (save) {
      return save.toJSON() as unknown as DetailInfo<typeof part>;
    }

    return null;
  }

  async set(
    data: DetailInfo<Products>,
    id?: string
  ): Promise<DetailInfo<Products>> {
    const { [data.part as Products]: detail, part, ...info } = data;

    let infoRow: PartInformation;
    if (id) {
      const row = await PartInformation.findByPk(id);
      if (!row) {
        throw new Error(`Cannot find the part with the id ${id}`);
      }
      infoRow = row.set(info);
    } else {
      infoRow = PartInformation.build({ part: part as Products, ...info });
    }

    await infoRow.save();
    id = infoRow.id;

    const [detailRow] = await Models[part as Products].findOrBuild({
      where: { id },
    });

    detailRow.set({ id, ...detail });

    await detailRow.save();

    const result = await this.get(part as Products, id);

    return result as DetailInfo<Products>;
  }

  async delete(id: string) {
    const save = await PartInformation.findByPk(id);

    if (save) {
      await save.destroy();

      return save.toJSON();
    }

    return null;
  }

  private IdSubQuery<T extends InferAttributes<any>>(
    name: string,
    options?: WhereOptions<T>
  ): string {
    return (this.Connection.getQueryInterface().queryGenerator as any)
      .selectQuery(name, { attributes: ["id"], where: options ?? {} })
      .slice(0, -1);
  }
}

type PageOptions = {
  page?: number;
  limit?: number;
};

export { PartService };
