import { MultipleChoiceInput } from "@/ui/Input";
import * as CPUBlock from "@pc-builder/shared/part/product/CPUBlock";

import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<CPUBlock.Filter> = {
  socket: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
  plate: ({ defaultValue, value, ...props }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      defaultValue={defaultValue}
      value={value}
      {...props}
    />
  ),
};

export default GenericFilterBar(Components, CPUBlock.AttributeLabels);
