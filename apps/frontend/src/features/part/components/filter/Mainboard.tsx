import * as Mainboard from "@pc-builder/shared/part/product/Mainboard";

import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Mainboard.Filter> = {
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
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Mainboard Form Factor"
    />
  ),
  ram_form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="ram_form_factor"
      attribute="ram_form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select RAM Form Factor"
    />
  ),
  ram_interface: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="ram_interface"
      attribute="ram_interface"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select RAM Interface"
    />
  ),
};

export default GenericFilterBar(Components, Mainboard.AttributeLabels);
