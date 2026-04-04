import { MultipleChoiceInput } from "@/ui/Input";
import Part from "@/utils/part";
import { GenericFilterBar, FilterMapping } from "../utils/Filter";

const Components: FilterMapping<{
  brand: string[];
  series: string[];
}> = {
  brand: ({ value, defaultValue }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      name={"brand"}
      value={value}
      defaultValue={defaultValue}
    />
  ),
  series: ({ value, defaultValue }) => (
    <MultipleChoiceInput
      className="flex-wrap gap-x-3"
      name={"brand"}
      value={value}
      defaultValue={defaultValue}
    />
  ),
};

export default GenericFilterBar(Components, Part.Label);
