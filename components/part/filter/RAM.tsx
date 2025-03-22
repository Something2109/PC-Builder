import {
  MultipleChoiceInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import RAM from "@/utils/interface/product/RAM";
import { MemoryUnits } from "@/utils/extract/Units";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

const Components: FilterMapping<RAM.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  capacity: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  interface: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, RAM.AttributeLabels);
