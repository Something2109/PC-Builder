namespace GPU {
  export type Core = {
    [key in string]: {
      generation?: number;
      count?: number;
    };
  };

  export type Features = {
    DirectX?: string;
    OpenGL?: string;
    OpenCL?: string;
    Vulkan?: string;
    CUDA?: string;
  };

  export type Info = {
    family: string;

    core_count: number;
    execution_unit: number;
    base_frequency: number;
    boost_frequency: number;
    extra_cores: Core;

    memory_size: number;
    memory_type: string;
    memory_bus: number;

    tdp: number;

    features: Features;
  };

  export const BasicAttrList: (keyof Info)[] = [
    "base_frequency",
    "boost_frequency",
    "memory_size",
    "memory_type",
    "tdp",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default GPU;
