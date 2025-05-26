import {
  MinMaxRangeInput,
  MultipleChoiceInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import GPU from "@/utils/interface/part/product/GPU";
import { FrequencyUnits, MemoryUnits } from "@/utils/extract/Units";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

const Components: FilterMapping<GPU.Filter> = {
  base_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  boost_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  memory_size: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  memory_type: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  tdp: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GPU.AttributeLabels);
