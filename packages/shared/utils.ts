import { z } from "zod";

import { UnitInterface } from "./Units";

type FilterOptionsType<Info extends object, Attributes extends keyof Info> = {
  [key in Attributes]?: NonNullable<Required<Info>[key]> extends number
    ? number[]
    : Required<Info>[key] extends string
      ? Required<Info>[key][]
      : string[];
};

const FilterOptions = <T extends z.ZodType>(zodType: T) =>
  z.preprocess((arg) => {
    return (Array.isArray(arg) ? arg : [arg])
      .map((val) => zodType.safeParse(val))
      .filter((val) => val.success)
      .map((val) => val.data);
  }, z.array(zodType));

const NumberFilterOptions = FilterOptions(z.number()).transform((arg) => {
  if (arg.length === 0) return [];

  if (arg.length === 1) return [0, arg[0]];

  return [arg[0], arg[arg.length - 1]];
});

function createModel<T extends { [key: string]: z.ZodSchema }, Required extends keyof T = never>(
  schema: z.ZodObject<T>,
  required?: Required[]
) {
  const newSchema = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) =>
      required?.includes(key as Required) ? [key, value] : [key, value.nullable()]
    )
  ) as {
    [key in keyof T]: key extends Required ? T[key] : ReturnType<T[key]["nullable"]>;
  };

  return z.object(newSchema);
}

function createDTO<T extends { [key: string]: z.ZodSchema }, Required extends keyof T = never>(
  schema: z.ZodObject<T>,
  required?: Required[]
) {
  const newSchema = Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) =>
      required?.includes(key as Required) ? [key, value] : [key, value.nullish()]
    )
  ) as {
    [key in keyof T]: key extends Required ? T[key] : ReturnType<T[key]["nullish"]>;
  };

  return z.object(newSchema);
}

function createUnit<U extends string, DefaultU extends U>(
  unitClass: UnitInterface<U>,
  defaultUnit: DefaultU
) {
  return z.coerce
    .number()
    .refine((val) => val >= 0)
    .meta({ unit: unitClass, target: defaultUnit });
}

function createSuffix(suffix: string) {
  return z.coerce
    .number()
    .refine((val) => val >= 0)
    .meta({ suffix });
}

export { NumberFilterOptions, FilterOptions, createModel, createDTO, createUnit, createSuffix };

export type { FilterOptionsType };
