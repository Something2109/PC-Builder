import {
  MultipleChoiceInput,
  MinMaxRangeInput,
} from "@/components/utils/Input";
import Pump from "@/utils/interface/product/Pump";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

const Components: FilterMapping<Pump.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  flow_rate: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput step={0.01} min={value[0]} max={value[1]} {...props} />
  ),
  power_connector: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  control_connector: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Pump.FilterLabels);
