import { MultipleChoiceInput } from "@/components/utils/Input";
import Radiator from "@/utils/interface/product/Radiator";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

const Components: FilterMapping<Radiator.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  material: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Radiator.AttributeLabels);
