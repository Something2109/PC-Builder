import * as GPU from "@pc-builder/shared/part/product/GPU";
import { FrequencyUnits, MemoryUnits } from "@pc-builder/shared/Units";

import { MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

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
  memory_type: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="memory_type"
      attribute="memory_type"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Memory Type"
    />
  ),
  tdp: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GPU.AttributeLabels);
