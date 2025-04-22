import { FilterOptions, NumberFilterOptions, Primitive } from "../../utils";
import { z } from "zod";

namespace GPU {
  const CoreSchema = z.record(
    Primitive.String,
    z
      .object({
        generation: Primitive.Number,
        count: Primitive.Number,
      })
      .partial()
  );

  const FeatureSchema = z
    .object({
      DirectX: Primitive.String,
      OpenGL: Primitive.String,
      OpenCL: Primitive.String,
      Vulkan: Primitive.String,
      CUDA: Primitive.String,
    })
    .partial();

  export const Schema = z.object({
    family: Primitive.String,

    core_count: Primitive.Number,
    execution_unit: Primitive.Number,
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,
    extra_cores: CoreSchema,

    memory_size: Primitive.Number,
    memory_type: Primitive.String,
    memory_bus: Primitive.Number,

    tdp: Primitive.Number,

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
      memory_type: FilterOptions(Primitive.String),
      tdp: NumberFilterOptions,
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default GPU;
