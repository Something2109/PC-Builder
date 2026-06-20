import { MultipleChoiceInput, UnitMinMaxRangeInput } from "@/ui/Input";
import * as RAM from "@pc-builder/shared/part/product/RAM";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<RAM.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  capacity: ({ value, defaultValue: _, ...props }) => (
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
