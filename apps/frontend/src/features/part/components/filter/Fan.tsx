import * as Fan from "@pc-builder/shared/part/product/Fan";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<Fan.Filter> = {
  form_factor: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="form_factor"
      attribute="form_factor"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Fan Form Factor"
    />
  ),
  bearing: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="bearing"
      attribute="bearing"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Bearing Type"
    />
  ),
};

export default GenericFilterBar(Components, Fan.AttributeLabels);
