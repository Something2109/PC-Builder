import { MultipleChoiceInput } from "@/components/utils/Input";
import AIO from "@/utils/interface/part/product/AIO";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<AIO.Filter> = {
  socket: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3 justify-between"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3 justify-between"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  cpu_plate: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3 justify-between"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, AIO.AttributeLabels);
