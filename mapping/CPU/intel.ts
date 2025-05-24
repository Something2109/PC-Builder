import {
  InfoMappingType,
  ProductMappingType,
  TableMapping,
  InfoParsing,
  ProductParsingType,
} from "mapping/utils";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
import CPUCoreConfig from "@/utils/interface/part/info/CPUCoreConfig";
import ProcessorCache from "@/utils/interface/part/info/ProcessorCache";
import GPUSpec from "@/utils/interface/part/info/GPUSpec";
import GPUPerformance from "@/utils/interface/part/info/GPUPerformance";
import GPUFeature from "@/utils/interface/part/info/GPUFeature";
import Part, { Mapping } from "@/utils/interface/part";
import { Infos, Products } from "@/utils/Enum";
import {
  CPUSpecParsers,
  CPUCoreConfigParsers,
  CPUPerformanceParsers,
  CPUMemoryParsers,
  GPUSpecParsers,
  GPUPerformanceParsers,
  GPUFeatureParsers,
  ProcessorCacheParsers,
} from "../validate";
import CPUMemory from "@/utils/interface/part/info/CPUMemory";

const PartMap: InfoMappingType<Omit<Part.BasicInfo, "part" | "id">> = {
  name: ["Model"],
  code_name: ["Processor Number"],
  brand: { raw: [], defaultValue: "Intel" },
  series: ["Product Collection"],
  url: ["url"],
  image_url: [],
  launch_date: ["Launch Date"],
};

const PartValidate: InfoParsing<Omit<Part.BasicInfo, "part" | "id" | "brand">> =
  {
    name: (value: unknown) => {
      if (typeof value !== "string") return null;

      let name = value as string;

      // Remove ® (\u00ae) and ™ (\u2122)
      name = name.replace(/[\u00ae\u2122]/g, "");
      // Remove "Processor" at the end
      name = name.replace(/\s*[Pp]rocessor$/, "");
      // Remove extra spaces
      name = name.replace(/\s+|-/g, " ").trim();
      return name;
    },
    code_name: (val: unknown) => (typeof val === "string" ? val.trim() : null),
    series: (val: unknown) => (typeof val === "string" ? val.trim() : null),
    launch_date: (val: unknown) => {
      if (val instanceof Date && !isNaN(val.getTime())) return val;

      if (typeof val !== "string") return null;

      const quarterMatch = val.match(/Q([1-4])(?:'| )(\d{2}|\d{4})/);
      if (quarterMatch) {
        const quarter = parseInt(quarterMatch[1], 10);
        let year = parseInt(quarterMatch[2], 10);
        if (year < 100) {
          year = year >= 80 ? 1900 + year : 2000 + year;
        }
        const month = (quarter - 1) * 3;
        return new Date(year, month, 15, 12);
      }

      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    },
  };

const CoreSpecMap: InfoMappingType<CPUSpec.Info> = {
  family: ["Product Collection"],
  socket: ["Sockets Supported"],
  total_cores: ["Total Cores", "Physical Core Count"],
  total_threads: ["Total Threads"],
  lithography: ["Lithography"],
};

const CPUPerformanceMap: InfoMappingType<CPUPerformance.Info> = {
  base_frequency: [
    "Processor Base Frequency",
    "Performance-core Base Frequency",
    "Efficient-core Base Frequency",
    "Low Power Efficient-core Base Frequency",
  ],
  turbo_frequency: [
    "Max Turbo Frequency",
    "Performance-core Max Turbo Frequency",
    "Efficient-core Max Turbo Frequency",
    "Low Power Efficient-core Max Turbo Frequency",
  ],
  tdp: ["TDP", "Processor Base Power"],
};

const ProcessorCacheMap: InfoMappingType<ProcessorCache.Info> = {
  L1_cache: [],
  L2_cache: ["Total L2 Cache"],
  L3_cache: ["Cache"],
};

const PCoreMap: InfoMappingType<CPUCoreConfig.Info> = {
  name: { raw: [], defaultValue: "Performance-core" },
  base_frequency: ["Performance-core Base Frequency"],
  turbo_frequency: ["Performance-core Max Turbo Frequency"],
  count: ["# of Performance-cores"],
};

const ECoreMap: InfoMappingType<CPUCoreConfig.Info> = {
  name: { raw: [], defaultValue: "Efficient-core" },
  base_frequency: ["Efficient-core Base Frequency"],
  turbo_frequency: ["Efficient-core Max Turbo Frequency"],
  count: ["# of Efficient-cores"],
};

const LPECoreMap: InfoMappingType<CPUCoreConfig.Info> = {
  name: { raw: [], defaultValue: "Low Power Efficient-core" },
  base_frequency: ["Low Power Efficient-core Base Frequency"],
  turbo_frequency: ["Low Power Efficient-core Max Turbo Frequency"],
  count: ["# of Low Power Efficient-cores"],
};

const CPUMemoryMap: InfoMappingType<CPUMemory.Info> = {
  type: ["Memory Types"],
  speed: ["Memory Types"],
  capacity: ["Max Memory Size (dependent on memory type)"],
  channel_count: ["Max # of Memory Channels"],
  bandwidth: ["Max Memory Bandwidth"],
};

const GPUSpecMap: InfoMappingType<GPUSpec.Info> = {
  family: ["GPU Name‡", "Graphics Name‡", "GPU Nameâ€¡"],
  core_count: [],
  rops: [],
  tmus: [],
  execution_unit: ["Execution Units", "Compute Units", "Xe-cores"],
  ray_tracing: [],
  tensor: [],
};

const GPUPerformanceMap: InfoMappingType<GPUPerformance.Info> = {
  base_frequency: ["Graphics Base Frequency", "Graphics Base Clock"],
  tdp: [],
  boost_frequency: [
    "Graphics Max Dynamic Frequency",
    "Graphics Max Dynamic Clock",
  ],
};

const GPUFeatureMap: InfoMappingType<GPUFeature.Info> = {
  DirectX: ["DirectX* Support"],
  OpenGL: ["OpenGL* Support"],
  OpenCL: ["OpenCL* Support"],
  Vulkan: ["Vulkan*  Support"],
  CUDA: [],
};

const CPUMapping: ProductMappingType<
  (typeof Mapping.Info)[Products.CPU][number]
> = {
  [Infos.CPU_SPEC]: [CoreSpecMap],
  [Infos.CPU_CORES]: [PCoreMap, ECoreMap, LPECoreMap],
  [Infos.CPU_PERF]: [CPUPerformanceMap],
  [Infos.CPU_MEMORY]: [CPUMemoryMap],
  [Infos.GPU_SPEC]: [GPUSpecMap],
  [Infos.GPU_PERF]: [GPUPerformanceMap],
  [Infos.GPU_FEAT]: [GPUFeatureMap],
  [Infos.PROCESSOR_CACHE]: [ProcessorCacheMap],
};

export const CPUValidate: ProductParsingType<
  (typeof Mapping.Info)[Products.CPU][number]
> = {
  [Infos.CPU_SPEC]: CPUSpecParsers,
  [Infos.CPU_CORES]: CPUCoreConfigParsers,
  [Infos.CPU_PERF]: CPUPerformanceParsers,
  [Infos.CPU_MEMORY]: CPUMemoryParsers,
  [Infos.GPU_SPEC]: GPUSpecParsers,
  [Infos.GPU_PERF]: GPUPerformanceParsers,
  [Infos.GPU_FEAT]: GPUFeatureParsers,
  [Infos.PROCESSOR_CACHE]: ProcessorCacheParsers,
};

async function read(cpu: any) {
  const [part] = TableMapping([PartMap], PartValidate)(cpu);

  const result: { [key in string]: any } = {};
  Object.entries(CPUMapping).forEach(([key, mappings]) => {
    const info = key as keyof typeof CPUMapping;
    const parse = TableMapping(mappings, CPUValidate[info]);

    const parsed = parse(cpu);

    if (parsed) result[info] = parsed;
  });

  return { ...part, ...result };
}

export { read };
