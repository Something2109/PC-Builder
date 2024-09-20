export namespace PartType {
  export type BasicInfo = {
    part: string;
    name: string;
    code_name: string;
    brand: string;
    family?: string;
    series: string;

    launch_date?: Date;
    url?: string;
    image_url?: string;
  };

  type ParticularAttributes =
    | "id"
    | "name"
    | "code_name"
    | "url"
    | "image_url"
    | "launch_date";

  export type Filterables = Exclude<keyof BasicInfo, ParticularAttributes>;

  export type FilterOptions = FilterOptionsType<BasicInfo, Filterables>;

  export namespace CPU {
    export type Core = {
      [key in string]: {
        count?: number;

        base_frequency: number;
        turbo_frequency?: number;
      };
    };

    export type Info = {
      socket: string;
      total_cores: number;
      total_threads: number;
      base_frequency?: number;
      turbo_frequency?: number;
      cores?: Core;

      L2_cache?: number;
      L3_cache?: number;
      max_memory?: number;
      max_memory_channel?: number;
      max_memory_bandwidth?: number;

      tdp: number;
      lithography: string;
    };

    type BasicAttributes =
      | "socket"
      | "total_cores"
      | "total_threads"
      | "base_frequency"
      | "turbo_frequency"
      | "L3_cache"
      | "tdp";

    export type Filterables = BasicAttributes;
  }

  export namespace GPU {
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
      core_count?: number;
      execution_unit?: number;
      base_frequency?: number;
      boost_frequency?: number;
      extra_cores: Core;

      memory_size?: number;
      memory_type?: string;
      memory_bus?: number;

      tdp: number;
      minimum_psu?: number;

      features: Features;
    };

    type BasicAttributes =
      | "base_frequency"
      | "boost_frequency"
      | "memory_size"
      | "memory_type"
      | "tdp"
      | "minimum_psu";

    export type Filterables = BasicAttributes;
  }

  export namespace GraphicCard {
    export type Info = {
      width: number;
      length: number;
      height: number;

      base_frequency: number;
      boost_frequency: number;

      pcie?: number;
      minimum_psu?: number;
      power_connector?: string;

      gpu?: GPU.Info;
    };

    type BasicAttributes =
      | "width"
      | "length"
      | "height"
      | "base_frequency"
      | "boost_frequency"
      | "minimum_psu";

    export type Filterables = BasicAttributes;
  }
}

type FilterOptionsType<Info extends {}, Attributes extends keyof Info> = {
  [key in Attributes]?: Required<Info>[key][];
};
