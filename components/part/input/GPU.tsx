import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, SuffixInput, UnitInput } from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import GPU from "@/utils/interface/part/info/GPU";
import { MemoryUnits, FrequencyUnits } from "@/utils/extract/Units";
import { Infos } from "@/utils/Enum";

const Schema = Part.Detail.shape[Infos.GPU];

const Components: InfoInputMapping<GPU.Info> = {
  family: (props) => <Input {...props} />,
  core_count: (props) => <Input type="number" {...props} />,
  execution_unit: (props) => <Input type="number" {...props} />,
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  boost_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  extra_cores: (props) => <></>,
  memory_size: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  memory_type: (props) => <Input {...props} />,
  memory_bus: (props) => <Input type="number" {...props} />,
  tdp: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  features: (props) => <></>,
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

  return Schema.parse(raw)!;
}

export default GenericInputTable(Components, GPU.Label, submit);
