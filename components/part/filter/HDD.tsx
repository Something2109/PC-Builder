import {
  MultipleChoiceInput,
  MinMaxRangeInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import HDD from "@/utils/interface/part/product/HDD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<HDD.Filter> = {
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
  read_speed: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  write_speed: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  rotational_speed: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, HDD.AttributeLabels);
