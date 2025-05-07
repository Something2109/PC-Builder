import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import GPU from "@/utils/interface/part/info/GPU";
import { FrequencyUnits, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GPU.Info> = {
  family: ({ defaultValue: value }) => value,
  core_count: ({ defaultValue: value }) => value,
  execution_unit: ({ defaultValue: value }) => value,
  base_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  boost_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  extra_cores: ({ defaultValue: value }) => value?.toString(),
  memory_size: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  memory_type: ({ defaultValue: value }) => value?.toString(),
  memory_bus: ({ defaultValue: value }) => value,
  tdp: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="W">{value}</SuffixDisplay>
  ),
  features: ({ defaultValue: value }) => value?.toString(),
};

export default InfoComponent(Components, GPU.Label, { strict: true });
