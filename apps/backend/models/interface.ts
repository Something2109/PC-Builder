import { Op, WhereOptions } from "sequelize";
import { Model } from "sequelize-typescript";

enum Tables {
  USER = "user",
  PART = "part_information",
  RETAIL_PRODUCT = "retail_product",
  ALIAS_ENTRY = "alias_entry",
  ALIAS_LEARNER_LOG = "alias_learner_log",
}

enum ModelScopes {
  SUMMARY = "summary",
  FILTER = "filter",
  DETAIL = "detail",
}

const PartDefaultScope = {
  attributes: {
    exclude: ["createdAt", "updatedAt"],
  },
};

function defaultFilter<T extends Model<Attributes, any>, Attributes extends {}>(options?: {
  [key in keyof Attributes]?: string[] | number[];
}) {
  if (!options) return {};

  const where = Object.entries(options).reduce((acc, [key, entries]) => {
    const data = entries as string[] | number[] | undefined;

    if (!data || data.length === 0) return acc;

    let targetKey = key;
    if (key === "brand") targetKey = "brandId";
    if (key === "series") targetKey = "seriesId";

    if (typeof data[0] === "number" && targetKey !== "brandId" && targetKey !== "seriesId") {
      acc[targetKey] = { [Op.between]: data };
    } else {
      acc[targetKey] = entries;
    }
    return acc;
  }, {} as any);

  return where as WhereOptions<T>;
}

export { Tables, ModelScopes, defaultFilter, PartDefaultScope };
