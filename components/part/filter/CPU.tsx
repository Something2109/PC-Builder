import {
  MultipleChoiceInput,
  MinMaxRangeInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import CPU from "@/utils/interface/part/product/CPU";
import { FrequencyUnits, MemoryUnits } from "@/utils/extract/Units";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<CPU.Filter> = {
  socket: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  total_cores: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
  total_threads: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),

  base_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  turbo_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  L3_cache: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  tdp: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, CPU.AttributeLabels);
