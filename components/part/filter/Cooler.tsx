import { MultipleChoiceInput } from "@/components/utils/Input";
import * as Cooler from "@/utils/part/product/Cooler";
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
