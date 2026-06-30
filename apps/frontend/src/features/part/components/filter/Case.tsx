import * as Case from "@pc-builder/shared/part/product/Case";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<Case.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Case Form Factor"
    />
  ),
  mainboard_support: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="mainboard_support"
      attribute="mainboard_support"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Motherboard Support"
    />
  ),
  radiator_support: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="radiator_support"
      attribute="radiator_support"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Radiator Support"
    />
  ),
  psu_support: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="psu_support"
      attribute="psu_support"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select PSU Support"
    />
  ),
};

export default GenericFilterBar(Components, Case.AttributeLabels);
