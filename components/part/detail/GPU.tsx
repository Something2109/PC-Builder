import { InfoComponentObject } from "../utils/Table";
import { GenericDetailTable } from "../TableWrapper";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import GPU from "@/utils/interface/part/info/GPU";
import { FrequencyUnits, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GPU.Info> = {
  family: ({ value }) => value,
  core_count: ({ value }) => value,
  execution_unit: ({ value }) => value,
  base_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  boost_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  extra_cores: ({ value }) => value?.toString(),
  memory_size: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  memory_type: ({ value }) => value?.toString(),
  memory_bus: ({ value }) => value,
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  features: ({ value }) => value?.toString(),
};

export default GenericDetailTable(Components, GPU.Label);
