import { z } from "zod";
import { Infos } from "../Enum";
import Part from "./info/Parts";
import { Information } from "./info";

/**
 * The detail information of a specific product.
 * Contains the most detailed information of the product from each {@link Infos} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export const DetailInfo = Part.Schema.merge(
  z.object(Information.Detail).partial()
);

export type DetailInfo = z.infer<typeof DetailInfo>;

/**
 * The filter options of the information.
 * Contains the filter options of each {@link Infos} type combined into one object.
 * This object is used to pass the filter conditions of the user to each {@link Infos} type.
 * This is a generic type used in all the {@link Products} type.
 * The specific information that each {@link Products} type contains
 * are declared in the mapping {@link ProductInfo}.
 */
export type FilterOptions = {
  [key in Infos | "part"]?: Record<string, string[] | number[]> | null;
};
