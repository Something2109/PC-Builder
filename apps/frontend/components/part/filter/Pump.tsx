import {
  MultipleChoiceInput,
  MinMaxRangeInput,
} from "@/components/utils/Input";
import * as Pump from "@/utils/part/product/Pump";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Pump.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  flow_rate: ({ value, defaultValue: _, ...props }) => (
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

export default GenericFilterBar(Components, Pump.AttributeLabels);
