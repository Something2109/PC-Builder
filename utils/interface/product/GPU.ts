import { FilterOptions, NumberFilterOptions, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace GPU {
  export const Label = "GPU";

  export const Primary = [Infos.GPU];
  export const Secondary = [];

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

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    core_count: "Core Count",
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",
    memory_size: "Memory Size",
    memory_type: "Memory Type",
    tdp: "Thermal Design Power",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    core_count: [Infos.GPU, "core_count"],
    base_frequency: [Infos.GPU, "base_frequency"],
    boost_frequency: [Infos.GPU, "boost_frequency"],
    memory_size: [Infos.GPU, "memory_size"],
    memory_type: [Infos.GPU, "memory_type"],
    tdp: [Infos.GPU, "tdp"],
  };
}

export default GPU;
