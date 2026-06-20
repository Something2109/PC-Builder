import { MultipleChoiceInput } from "@/ui/Input";
import * as Radiator from "@pc-builder/shared/part/product/Radiator";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Radiator.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  material: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Radiator.AttributeLabels);
