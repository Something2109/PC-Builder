import * as Radiator from "@pc-builder/shared/part/product/Radiator";

import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Radiator.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Radiator Form Factor"
    />
  ),
  material: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="material"
      attribute="material"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Material"
    />
  ),
};

export default GenericFilterBar(Components, Radiator.AttributeLabels);
