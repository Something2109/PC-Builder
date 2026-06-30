import * as CPU from "@pc-builder/shared/part/product/CPU";
import { FrequencyUnits, MemoryUnits } from "@pc-builder/shared/Units";

import { MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";
import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<CPU.Filter> = {
  socket: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="socket"
      attribute="socket"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Socket"
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
