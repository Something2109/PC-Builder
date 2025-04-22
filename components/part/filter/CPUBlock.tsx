import { MultipleChoiceInput } from "@/components/utils/Input";
import CPUBlock from "@/utils/interface/part/product/CPUBlock";
import { GenericFilterBar, FilterMapping } from "../TableWrapper";

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
