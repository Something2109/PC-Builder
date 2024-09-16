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
  }
}
