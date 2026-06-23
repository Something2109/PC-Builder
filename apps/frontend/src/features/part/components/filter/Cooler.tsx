import * as Cooler from "@pc-builder/shared/part/product/Cooler";

import { MultipleChoiceInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Cooler.Filter> = {
  socket: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  cpu_plate: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Cooler.AttributeLabels);
