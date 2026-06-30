import * as PSU from "@pc-builder/shared/part/product/PSU";

import { MinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<PSU.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select PSU Form Factor"
    />
  ),
  wattage: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
  efficiency: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="efficiency"
      attribute="efficiency"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Efficiency Rating"
    />
  ),
  modular: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="modular"
      attribute="modular"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Modularity"
    />
  ),
};

export default GenericFilterBar(Components, PSU.AttributeLabels);
