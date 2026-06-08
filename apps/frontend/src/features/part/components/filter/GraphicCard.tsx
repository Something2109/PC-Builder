import {
  MinMaxRangeInput,
  UnitMinMaxRangeInput,
} from "@/ui/Input";
import * as GraphicCard from "@/utils/part/product/GraphicCard";
import { FrequencyUnits, LengthUnits } from "@/utils/Units";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<GraphicCard.Filter> = {
  length: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  base_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  boost_frequency: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  width: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  height: ({ value, defaultValue: _, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  minimum_psu: ({ value, defaultValue: _, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GraphicCard.AttributeLabels);
