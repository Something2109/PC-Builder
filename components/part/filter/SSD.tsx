import {
  MultipleChoiceInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import * as SSD from "@/utils/part/product/SSD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/Units";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<SSD.Filter> = {
  memory_type: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
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
  read_speed: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  write_speed: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, SSD.AttributeLabels);
