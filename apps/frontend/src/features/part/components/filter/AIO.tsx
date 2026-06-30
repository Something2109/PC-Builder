import * as AIO from "@pc-builder/shared/part/product/AIO";

import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<AIO.Filter> = {
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
      placeholder="Select Form Factor"
    />
  ),
  cpu_plate: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="cpu_plate"
      attribute="cpu_plate"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select CPU Plate"
    />
  ),
};

export default GenericFilterBar(Components, AIO.AttributeLabels);
