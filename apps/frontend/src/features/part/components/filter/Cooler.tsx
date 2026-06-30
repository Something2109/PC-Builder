import * as Cooler from "@pc-builder/shared/part/product/Cooler";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";
import ScrollSelect from "./ScrollSelect";

const Components: FilterMapping<Cooler.Filter> = {
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
  cpu_plate: ({ defaultValue, product, context }) => (
    <ScrollSelect
      name="cpu_plate"
      attribute="cpu_plate"
      product={product}
      context={context}
      defaultValue={defaultValue as string[]}
      placeholder="Select Plate Material"
    />
  ),
};

export default GenericFilterBar(Components, Cooler.AttributeLabels);
