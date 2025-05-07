import CPU from "@/utils/interface/part/info/CPU";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import {
  FrequencyUnits,
  MemorySpeedUnit,
  MemoryUnits,
} from "@/utils/extract/Units";

const Components: InfoComponentObject<CPU.Info> = {
  family: ({ defaultValue: value }) => value,
  socket: ({ defaultValue: value }) => value,
  total_cores: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="Cores">{value}</SuffixDisplay>
  ),
  total_threads: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="Threads">{value}</SuffixDisplay>
  ),
  base_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={value} />
  ),
  turbo_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={value} />
  ),
  cores: ({ defaultValue: value }) => value?.toString(),
  L2_cache: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  L3_cache: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  max_memory: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  max_memory_channel: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="channel(s)">{value}</SuffixDisplay>
  ),
  max_memory_bandwidth: ({ defaultValue: value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="GB/s"
      displayUnit={["GB/s"]}
      defaultValue={value}
    />
  ),
  tdp: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="W">{value}</SuffixDisplay>
  ),
  lithography: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, CPU.Label, { strict: true });
