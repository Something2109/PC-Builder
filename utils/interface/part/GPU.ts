import { FilterOptions, NumberFilterOptions } from "../utils";
import { z } from "zod";

namespace GPU {
  const CoreSchema = z.record(
    z.string(),
    z
      .object({
        generation: z.number(),
        count: z.number(),
      })
      .partial()
  );

  const FeatureSchema = z
    .object({
      DirectX: z.string(),
      OpenGL: z.string(),
      OpenCL: z.string(),
      Vulkan: z.string(),
      CUDA: z.string(),
    })
    .partial();

  export const Schema = z.object({
    family: z.string(),

    core_count: z.number(),
    execution_unit: z.number(),
    base_frequency: z.number(),
    boost_frequency: z.number(),
    extra_cores: CoreSchema,

    memory_size: z.number(),
    memory_type: z.string(),
    memory_bus: z.number(),

    tdp: z.number(),

    features: FeatureSchema,
  });

  export type Core = z.infer<typeof CoreSchema>;

  export type Features = z.infer<typeof FeatureSchema>;

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    family: "Family",

    core_count: "Core Count",
    execution_unit: "Execution Unit",
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",
    extra_cores: "Extra Cores",

    memory_size: "Memory Size",
    memory_type: "Memory Type",
    memory_bus: "Memory Bus",

    tdp: "TDP",

    features: "Features",
  };

  export const SummarySchema = Schema.pick({
    core_count: true,
    memory_size: true,
    base_frequency: true,
    boost_frequency: true,
    tdp: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      base_frequency: NumberFilterOptions,
      boost_frequency: NumberFilterOptions,
      memory_size: NumberFilterOptions,
      memory_type: FilterOptions(z.string()),
      tdp: NumberFilterOptions,
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default GPU;
