import { MultipleChoiceInput, MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";
import * as CPU from "@pc-builder/shared/part/product/CPU";
import { FrequencyUnits, MemoryUnits } from "@pc-builder/shared/Units";

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
  total_cores: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
  total_threads: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),

  base_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  turbo_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  L3_cache: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  tdp: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, CPU.AttributeLabels);
