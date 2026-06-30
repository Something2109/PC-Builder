import * as RAM from "@pc-builder/shared/part/product/RAM";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { UnitMinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<RAM.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select RAM Form Factor"
    />
  ),
  capacity: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
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
      placeholder="Select RAM Interface"
    />
  ),
};

export default GenericFilterBar(Components, RAM.AttributeLabels);
