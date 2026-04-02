import { Primitive } from "../../interface";
import { FilterOptions, NumberFilterOptions } from "../../utils";
import { z } from "zod";

export const Label = "GPU";

export const Summary = z
  .object({
    core_count: Primitive.Number,
    memory_size: Primitive.Number,
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,
    tdp: Primitive.Number,
  })
  .partial();

export type Summary = z.infer<typeof Summary>;

export const Filter = z
  .object({
    base_frequency: NumberFilterOptions,
    boost_frequency: NumberFilterOptions,
    memory_size: NumberFilterOptions,
    memory_type: FilterOptions(Primitive.String),
    tdp: NumberFilterOptions,
  })
  .partial();

export type Filter = z.infer<typeof Filter>;

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  core_count: "Core Count",
  base_frequency: "Base Frequency",
  boost_frequency: "Boost Frequency",
  memory_size: "Memory Size",
  memory_type: "Memory Type",
  tdp: "Thermal Design Power",
};
