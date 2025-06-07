import { Infos, Products } from "../../Enum";
import { createDTO, createModel, FilterOptions, Primitive } from "../utils";
import { z } from "zod";
import { Product } from "./product";
import { Mapping } from "./mapping";
import { Information } from "./info";

namespace Part {
  export const BasicInfo = z.object({
    id: Primitive.String,

    part: z.nativeEnum(Products),
    name: Primitive.String,
    code_name: Primitive.String,
    brand: Primitive.String,
    series: Primitive.String,

    launch_date: z.coerce.date(),
    url: Primitive.String.url(),
    image_url: Primitive.String.url(),
  });

  export type BasicInfo = z.infer<typeof BasicInfo>;

  export const Label: { [key in Required<keyof BasicInfo>]: string } = {
    id: "ID",
    part: "Product Type",
    name: "Name",
    code_name: "Code Name",
    brand: "Brand",
    series: "Series",

    launch_date: "Launch Date",
    url: "Brand URL",
    image_url: "Image URL",
  };

  const BasicSummarySchema = BasicInfo.pick({
    id: true,
    part: true,
    name: true,
    brand: true,
    series: true,
    image_url: true,
  });

  const BasicFilterSchema = z
    .object({
      id: FilterOptions(Primitive.String),
      part: FilterOptions(Primitive.String),
      name: FilterOptions(Primitive.String),
      code_name: FilterOptions(Primitive.String),
      brand: FilterOptions(Primitive.String),
      series: FilterOptions(Primitive.String),

      launch_date: FilterOptions(Primitive.String),
      url: FilterOptions(Primitive.String),
      image_url: FilterOptions(Primitive.String),
    })
    .partial();

  export const BasicAttributes = BasicInfo.keyof();

  export type BasicAttributes = z.infer<typeof BasicAttributes>;

  export const BasicSummaryAttributes = BasicSummarySchema.keyof().options;

  export const BasicFilterAttributes = BasicFilterSchema.pick({
    part: true,
    brand: true,
    series: true,
  }).keyof().options;

  export type Summary<product extends Products | undefined = undefined> =
    product extends Products
      ? z.infer<typeof BasicSummarySchema> &
          z.infer<(typeof Product.Summary)[product]>
      : z.infer<typeof BasicSummarySchema>;

  export type Filter = {
    part?: z.infer<typeof BasicFilterSchema>;
  } & {
    [key in Infos]?: Record<string, string[] | number[]> | null;
  };

  export const Model = createModel(Part.BasicInfo, [
    "id",
    "name",
    "code_name",
  ]).merge(z.object(Information.Model));

  export type Model = z.infer<typeof Model>;

  export const DTO = createDTO(Part.BasicInfo.omit({ id: true }), [
    "name",
    "code_name",
  ]).merge(z.object(Information.DTO).partial());

  export type DTO = z.infer<typeof DTO>;

  /**
   * The `Infer` namespace provides types to infer information and attributes
   * based on the part's {@link DTO} info.
   */
  export namespace Infer {
    /**
     * Type representing the information type for a given info key.
     * @template I - The info key from the `Infos` enum.
     * * This type extracts the type of information associated with the given info key.
     */
    export type InfoType<I extends Infos> = NonNullable<
      Part.Detail[I]
    > extends Information.Info[I][]
      ? (Information.Info[I] | undefined)[]
      : Information.Info[I] | undefined;

    /**
     * Type representing the attribute type for a given info key and attribute name.
     * @template I - The info key from the `Infos` enum.
     * @template A - The attribute name as a string.
     * * This type extracts the type of the attribute associated with the given info key and attribute name.
     * * It ensures that if the information is an array, the type is an array of the attribute type.
     */
    export type AttributeType<
      I extends Infos,
      A extends string
    > = A extends keyof Information.Info[I]
      ? NonNullable<Part.Detail[I]> extends Information.Info[I][]
        ? (Information.Info[I][A] | undefined)[]
        : Information.Info[I][A] | undefined
      : undefined;
  }

  export type Infer<I extends Infos, A extends string = ""> = A extends ""
    ? Infer.InfoType<I>
    : Infer.AttributeType<I, A>;
}

export default Part;

export { Product, Information, Mapping };
