import * as Pump from "@pc-builder/shared/part/product/Pump";

import { MinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<Pump.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Pump Form Factor"
    />
  ),
  flow_rate: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput step={0.01} min={value[0]} max={value[1]} {...props} />
  ),
  power_connector: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="power_connector"
      attribute="power_connector"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Power Connector"
    />
  ),
  control_connector: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="control_connector"
      attribute="control_connector"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Control Connector"
    />
  ),
};

export default GenericFilterBar(Components, Pump.AttributeLabels);
