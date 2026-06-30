import * as CPUBlock from "@pc-builder/shared/part/product/CPUBlock";

import ScrollSelect from "./ScrollSelect";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<CPUBlock.Filter> = {
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
  plate: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="plate"
      attribute="plate"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Plate Material"
    />
  ),
};

export default GenericFilterBar(Components, CPUBlock.AttributeLabels);
