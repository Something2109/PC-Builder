import * as GraphicCard from "@pc-builder/shared/part/product/GraphicCard";
import { FrequencyUnits, LengthUnits } from "@pc-builder/shared/Units";

import { MinMaxRangeInput, UnitMinMaxRangeInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<GraphicCard.Filter> = {
  length: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  base_frequency: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  boost_frequency: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  width: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  height: ({ value: _, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={defaultValue?.[0]}
      max={defaultValue?.[1]}
      {...props}
    />
  ),
  minimum_psu: ({ value: _, defaultValue, ...props }) => (
    <MinMaxRangeInput min={defaultValue?.[0]} max={defaultValue?.[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GraphicCard.AttributeLabels);
