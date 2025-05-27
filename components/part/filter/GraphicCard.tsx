import {
  MinMaxRangeInput,
  UnitMinMaxRangeInput,
} from "@/components/utils/Input";
import GraphicCard from "@/utils/interface/part/product/GraphicCard";
import { FrequencyUnits, LengthUnits } from "@/utils/extract/Units";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<GraphicCard.Filter> = {
  length: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  base_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  boost_frequency: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  width: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  height: ({ value, defaultValue, ...props }) => (
    <UnitMinMaxRangeInput
      Unit={LengthUnits}
      defaultUnit="mm"
      step={0.01}
      min={value[0]}
      max={value[1]}
      {...props}
    />
  ),
  minimum_psu: ({ value, defaultValue, ...props }) => (
    <MinMaxRangeInput min={value[0]} max={value[1]} {...props} />
  ),
};

export default GenericFilterBar(Components, GraphicCard.AttributeLabels);
