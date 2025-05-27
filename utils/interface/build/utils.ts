import Part, { Information } from "../part";
import { Primitive } from "../utils";
import { Infos, Products } from "@/utils/Enum";
import { z } from "zod";

const BuildPartSchema = z
  .object({
    [Products.CPU]: Primitive.String,
    [Products.GPU]: z.undefined(),
    [Products.GRAPHIC_CARD]: z.array(Primitive.String),
    [Products.MAIN]: Primitive.String,
    [Products.RAM]: z.array(Primitive.String),
    [Products.SSD]: z.array(Primitive.String),
    [Products.HDD]: z.array(Primitive.String),
    [Products.PSU]: Primitive.String,
    [Products.CASE]: Primitive.String,
    [Products.COOLER]: Primitive.String,
    [Products.AIO]: Primitive.String,
    [Products.FAN]: z.array(Primitive.String),
    [Products.CPU_BLOCK]: Primitive.String,
    [Products.PUMP]: Primitive.String,
    [Products.RADIATOR]: Primitive.String,
  })
  .partial();

type BuildPartList = z.infer<typeof BuildPartSchema>;

type InfoTuple<P extends Products, I extends Infos> = [P, I] | readonly [P, I];

type AttributeTuple<P extends Products, I extends Infos, A extends string> =
  | [P, I, A]
  | readonly [P, I, A];

type ValidateValue<T> = T extends InfoTuple<infer P, infer I>
  ? Required<BuildPartList>[P] extends string[]
    ? Part.Infer.InfoType<I>[]
    : Part.Infer.InfoType<I>
  : T extends AttributeTuple<infer P, infer I, infer A>
  ? Required<BuildPartList>[P] extends string[]
    ? Part.Infer.AttributeType<I, A>[]
    : Part.Infer.AttributeType<I, A>
  : undefined;

type FilterValue<T> = T extends InfoTuple<infer P, infer I>
  ? { [key in keyof Information.Info[I]]?: string[] | number[] }
  : T extends AttributeTuple<infer P, infer I, infer A>
  ? string[] | number[]
  : undefined;

type BuildAttributeMapping = {
  [key in string]:
    | InfoTuple<Products, Infos>
    | AttributeTuple<Products, Infos, string>;
};

type BuildValidateAttributes<T extends BuildAttributeMapping> = {
  [key in keyof T]?: ValidateValue<T[key]>;
};

type BuildFilterAttributes<T extends BuildAttributeMapping> = {
  -readonly [key in keyof T]?: FilterValue<T[key]>;
};

interface GenericRule {
  name: string;

  validate(build: BuildPartList): string[];
}

interface ProductRule<T extends BuildAttributeMapping> {
  name: string;

  attributes: T;

  validate(build: Readonly<BuildValidateAttributes<T>>): string | undefined;

  filter(build: Readonly<BuildValidateAttributes<T>>): BuildFilterAttributes<T>;
}

export type {
  GenericRule,
  ProductRule,
  BuildPartList,
  BuildAttributeMapping,
  BuildFilterAttributes,
  BuildValidateAttributes,
};

export { BuildPartSchema };
