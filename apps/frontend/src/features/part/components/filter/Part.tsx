import Part from "@pc-builder/shared/part";

import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<{
  brand: { id: number; name: string }[];
  series: { id: number; name: string }[];
}> = {
  brand: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="brand"
      attribute="brand"
      product={product}
      context={context}
      defaultValue={defaultValue as unknown as string[]}
      placeholder="Select Brand"
    />
  ),
  series: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="series"
      attribute="series"
      product={product}
      context={context}
      defaultValue={defaultValue as unknown as string[]}
      placeholder="Select Series"
    />
  ),
};

export default GenericFilterBar(Components, Part.Label);
