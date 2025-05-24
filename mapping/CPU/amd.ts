import {
  InfoMappingType,
  ProductMappingType,
  TableMapping,
  InfoParsing,
  ProductParsingType,
} from "mapping/utils";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
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
  GPUSpecParsers,
  GPUPerformanceParsers,
  GPUFeatureParsers,
  ProcessorCacheParsers,
  CPUMemoryParsers,
} from "../validate";
import CPUMemory from "@/utils/interface/part/info/CPUMemory";

const PartMap: InfoMappingType<Omit<Part.BasicInfo, "part" | "id">> = {
  name: ["Name"],
  code_name: ["Model"],
  brand: { raw: [], defaultValue: "AMD" },
  series: ["Series"],
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
      name = name.replace(/\s*Processor$/, "");
      // Remove extra spaces
      name = name.replace(/\s+/g, " ").trim();
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
        return new Date(year, month, 15);
      }

      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    },
  };

const CoreSpecMap: InfoMappingType<CPUSpec.Info> = {
  family: ["Family"],
  socket: ["CPU Socket"],
  total_cores: ["# of CPU Cores"],
  total_threads: ["# of Threads"],
  lithography: ["Processor Technology for CPU Cores"],
};

const CPUPerformanceMap: InfoMappingType<CPUPerformance.Info> = {
  base_frequency: ["Base Clock"],
  turbo_frequency: ["Max. Boost Clock"],
  tdp: ["Default TDP"],
};

const ProcessorCacheMap: InfoMappingType<ProcessorCache.Info> = {
  L1_cache: ["L1 Cache"],
  L2_cache: ["L2 Cache", "Total L2 Cache"],
  L3_cache: ["L3 Cache"],
};

const CPUMemoryMap: InfoMappingType<CPUMemory.Info> = {
  type: ["System Memory Type"],
  speed: ["System Memory Specification"],
  capacity: ["Max Memory Size (dependent on memory type)"],
  channel_count: ["Memory Channels"],
  bandwidth: ["Max Memory Bandwidth"],
};

const GPUSpecMap: InfoMappingType<GPUSpec.Info> = {
  family: ["Graphics Model"],
  core_count: [],
  rops: [],
  tmus: [],
  execution_unit: ["Graphics Core Count"],
  ray_tracing: [],
  tensor: [],
};

const GPUPerformanceMap: InfoMappingType<GPUPerformance.Info> = {
  base_frequency: ["Graphics Frequency"],
  boost_frequency: ["Graphics Frequency"],
  tdp: [],
};

const GPUFeatureMap: InfoMappingType<GPUFeature.Info> = {
  DirectX: [],
  OpenGL: [],
  OpenCL: [],
  Vulkan: [],
  CUDA: [],
};

const CPUMapping: ProductMappingType<
  (typeof Mapping.Info)[Products.CPU][number]
> = {
  [Infos.CPU_SPEC]: [CoreSpecMap],
  [Infos.CPU_CORES]: [],
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
