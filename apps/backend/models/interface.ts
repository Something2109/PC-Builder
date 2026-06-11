import { Op, WhereOptions } from "sequelize";
import { Model } from "sequelize-typescript";

enum Tables {
  ARTICLE = "article",
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

function defaultFilter<
  T extends Model<Attributes, any>,
  Attributes extends {},
>(options?: { [key in keyof Attributes]?: string[] | number[] }) {
  if (!options) return {};

  const where = Object.entries(options).reduce((acc, [key, entries]) => {
    const data = entries as string[] | number[] | undefined;

    if (!data || data.length === 0) return acc;

    acc[key] = typeof data[0] === "number" ? { [Op.between]: data } : entries;
    return acc;
  }, {} as any);

  return where as WhereOptions<T>;
}

export { Tables, ModelScopes, defaultFilter, PartDefaultScope };
