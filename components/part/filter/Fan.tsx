import { MultipleChoiceInput } from "@/components/utils/Input";
import Fan from "@/utils/interface/part/product/Fan";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Fan.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  bearing: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Fan.AttributeLabels);
