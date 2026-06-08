import {
  MinMaxRangeInput,
  MultipleChoiceInput,
  UnitMinMaxRangeInput,
} from "@/ui/Input";
import * as GPU from "@/utils/part/product/GPU";
import { FrequencyUnits, MemoryUnits } from "@/utils/Units";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<GPU.Filter> = {
  base_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  boost_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  memory_size: ({ value, defaultValue: _, ...props }) => (
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
  tdp: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GPU.AttributeLabels);
