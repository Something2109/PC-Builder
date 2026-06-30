import * as CPU from "@pc-builder/shared/part/product/CPU";
import { FrequencyUnits, MemoryUnits } from "@pc-builder/shared/Units";

import { MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

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
  total_cores: ({ value: _, defaultValue, ...props }) => (
    <MinMaxRangeInput min={defaultValue?.[0]} max={defaultValue?.[1]} {...props} />
  ),
  total_threads: ({ value: _, defaultValue, ...props }) => (
    <MinMaxRangeInput min={defaultValue?.[0]} max={defaultValue?.[1]} {...props} />
  ),

  base_frequency: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  turbo_frequency: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  L3_cache: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  tdp: ({ value: _, defaultValue, ...props }) => (
    <MinMaxRangeInput min={defaultValue?.[0]} max={defaultValue?.[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, CPU.AttributeLabels);
