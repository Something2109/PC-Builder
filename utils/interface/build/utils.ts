import Part, { Information } from "../part";
import { Primitive } from "../utils";
import { Infos, Products } from "@/utils/Enum";
import { z } from "zod";

namespace Info {
  export type Tuple<P extends Products, I extends Infos> =
    | [P, I]
    | readonly [P, I];

  export type Validate<I extends Infos> = Part.Infer.InfoType<I>;

  export type Result = string[] | string | undefined;

  export type Filter<I extends Infos> = {
    [key in keyof Information.Info[I]]?: string[] | number[];
  };
}

namespace Attribute {
  export type Tuple<P extends Products, I extends Infos, A extends string> =
    | [P, I, A]
    | readonly [P, I, A];

  export type Validate<
    I extends Infos,
    A extends string
  > = Part.Infer.AttributeType<I, A>;

  export type Result = string | undefined;

  export type Filter = string[] | number[];
}

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

type BuildPartDetails<T = Part.Model> = {
  [key in keyof Required<BuildPartList>]?: Required<BuildPartList>[key] extends string[]
    ? T[]
    : Required<BuildPartList>[key] extends string
    ? T
    : never;
};

type BuildListInferValue<
  P extends Products,
  V
> = Required<BuildPartList>[P] extends string[] ? V[] : V;

type BuildAttributeMapping = {
  [key in string]:
    | Info.Tuple<Products, Infos>
    | Attribute.Tuple<Products, Infos, string>;
};

type BuildValidateAttributes<T extends BuildAttributeMapping> = {
  -readonly [key in keyof T]: T[key] extends Info.Tuple<infer P, infer I>
    ? BuildListInferValue<P, Info.Validate<I>>
    : T[key] extends Attribute.Tuple<infer P, infer I, infer A>
    ? BuildListInferValue<P, Attribute.Validate<I, A>>
    : undefined;
};

type BuildAttributeValue<
  T extends BuildAttributeMapping,
  A extends keyof T
> = T[A] extends Info.Tuple<Products, infer I>
  ? Info.Validate<I>
  : T[A] extends Attribute.Tuple<Products, infer I, infer A>
  ? Attribute.Validate<I, A>
  : undefined;

type BuildValidateResult<T extends BuildAttributeMapping> = {
  -readonly [key in keyof T]?: T[key] extends Info.Tuple<infer P, Infos>
    ? BuildListInferValue<P, Info.Result>
    : T[key] extends Attribute.Tuple<infer P, Infos, string>
    ? BuildListInferValue<P, Attribute.Result>
    : undefined;
};

type BuildResultValue<
  T extends BuildAttributeMapping,
  A extends keyof T
> = T[A] extends Info.Tuple<Products, Infos>
  ? Info.Result
  : T[A] extends Attribute.Tuple<Products, Infos, string>
  ? Attribute.Result
  : undefined;

type BuildFilterAttributes<T extends BuildAttributeMapping> = {
  -readonly [key in keyof T]?: T[key] extends Info.Tuple<Products, infer I>
    ? Info.Filter<I>
    : T[key] extends Attribute.Tuple<Products, Infos, string>
    ? Attribute.Filter
    : undefined;
};

type BuildFilterValue<
  T extends BuildAttributeMapping,
  A extends keyof T
> = T[A] extends Info.Tuple<Products, infer I>
  ? Info.Filter<I>
  : T[A] extends Attribute.Tuple<Products, Infos, string>
  ? Attribute.Filter
  : undefined;

interface ProductRule {
  name: string;

  validate(build: BuildPartDetails): { [key in Products]?: string };
}

interface AttributeRule<T extends BuildAttributeMapping> {
  name: string;

  attributes: T;

  validate(
    build: Readonly<BuildValidateAttributes<T>>
  ): BuildValidateResult<T> | string | undefined;

  filter(build: Readonly<BuildValidateAttributes<T>>): BuildFilterAttributes<T>;
}

export type {
  ProductRule,
  AttributeRule,
  BuildPartList,
  BuildPartDetails,
  BuildAttributeMapping,
  BuildAttributeValue,
  BuildValidateAttributes,
  BuildValidateResult,
  BuildResultValue,
  BuildFilterAttributes,
  BuildFilterValue,
};

export { BuildPartSchema };
