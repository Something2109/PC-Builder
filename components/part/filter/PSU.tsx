import {
  MultipleChoiceInput,
  MinMaxRangeInput,
} from "@/components/utils/Input";
import PSU from "@/utils/interface/product/PSU";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

const Components: FilterMapping<PSU.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  wattage: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
  efficiency: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  modular: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, PSU.AttributeLabels);
