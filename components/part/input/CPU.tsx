import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { Input, SuffixInput, UnitInput } from "@/components/utils/Input";
import {
  FrequencyUnits,
  MemorySpeedUnit,
  MemoryUnits,
} from "@/utils/extract/Units";
import CPU from "@/utils/interface/part/info/CPU";

export const Components: InfoComponentObject<CPU.Info> = {
  family: (props) => <Input {...props} />,
  socket: (props) => <Input {...props} />,
  total_cores: (props) => (
    <SuffixInput suffix="Cores" type="number" {...props} />
  ),
  total_threads: (props) => (
    <SuffixInput suffix="Threads" type="number" {...props} />
  ),
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  turbo_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  cores: (props) => <></>,
  L2_cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  L3_cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  max_memory: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  max_memory_channel: (props) => (
    <SuffixInput suffix="channel(s)" type="number" {...props} />
  ),
  max_memory_bandwidth: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="GB/s" {...props} />
  ),
  tdp: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  lithography: (props) => <Input {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return CPU.Schema.parse(raw)!;
}

export default GenericInputField(InfoComponent(Components, CPU.Label), submit);
