import * as Fan from "@pc-builder/shared/part/product/Fan";

import { MultipleChoiceInput } from "@/ui/Input";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<Fan.Filter> = {
  form_factor: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  bearing: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, Fan.AttributeLabels);
