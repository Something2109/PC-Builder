import CPU from "@/utils/interface/info/CPU";
import { GenericDetailTable, InfoDetailMapping } from "../TableWrapper";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import {
  FrequencyUnits,
  MemorySpeedUnit,
  MemoryUnits,
} from "@/utils/extract/Units";

const Components: InfoDetailMapping<CPU.Info> = {
  family: ({ value }) => value,
  socket: ({ value }) => value,
  total_cores: ({ value }) => (
    <SuffixDisplay suffix="Cores">{value}</SuffixDisplay>
  ),
  total_threads: ({ value }) => (
    <SuffixDisplay suffix="Threads">{value}</SuffixDisplay>
  ),
  base_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={value} />
  ),
  turbo_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={value} />
  ),
  cores: ({ value }) => value?.toString(),
  L2_cache: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  L3_cache: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  max_memory: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  max_memory_channel: ({ value }) => (
    <SuffixDisplay suffix="channel(s)">{value}</SuffixDisplay>
  ),
  max_memory_bandwidth: ({ value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="GB/s"
      displayUnit={["GB/s"]}
      defaultValue={value}
    />
  ),
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  lithography: ({ value }) => value,
};

export default GenericDetailTable(Components, CPU.Label);
