import { MultipleChoiceInput } from "@/components/utils/Input";
import Fan from "@/utils/interface/product/Fan";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

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
