import * as HDD from "@pc-builder/shared/part/product/HDD";
import { MemorySpeedUnit, MemoryUnits } from "@pc-builder/shared/Units";

import { MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<HDD.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select HDD Form Factor"
    />
  ),
  capacity: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  interface: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="interface"
      attribute="interface"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Interface"
    />
  ),
  read_speed: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  write_speed: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  rotational_speed: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, HDD.AttributeLabels);
