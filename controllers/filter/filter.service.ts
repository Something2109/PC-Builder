import { InferAttributes, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { PartInformation } from "@/models/parts/tables/Part";
import { Products } from "@/utils/Enum";
import { FilterOptions } from "@/utils/interface";
import { Models, ModelFilters } from "@/models/parts";
import { Tables } from "@/models/interface";
import { Injectable } from "@nestjs/common";

@Injectable()
class FilterService {
  constructor(private Connection: Sequelize) {}

  private IdSubQuery<T extends InferAttributes<any>>(
    name: string,
    options?: WhereOptions<T>
  ): string {
    return (this.Connection.getQueryInterface().queryGenerator as any)
      .selectQuery(name, { attributes: ["id"], where: options ?? {} })
      .slice(0, -1);
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
}

export { FilterService };
