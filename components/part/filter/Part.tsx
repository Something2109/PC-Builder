import { VerticalCollapsible } from "@/components/utils/Collapsible";
import { MultipleChoiceInput } from "@/components/utils/Input";
import { Toggler } from "@/components/utils/Toggle";

export default function PartFilter({
  defaultValue,
  value,
}: {
  defaultValue: URLSearchParams;
  value?: Record<string, string[] | number[]>;
}) {
  return (
    <>
      <input
        defaultValue={defaultValue.get("q") ?? ""}
        type="text"
        name="q"
        placeholder="Search"
        className="rounded-2xl border-2 border-line px-4 py-1 focus:outline-none w-full bg-transparent"
      />
      <Toggler
        className="w-full"
        label={"Add Brand Filter"}
        defaultToggle={defaultValue.getAll("brand").length > 0}
      >
        <VerticalCollapsible className="w-full">
          <label>Brand</label>
          <MultipleChoiceInput
            className="flex-wrap gap-x-3"
            name={"brand"}
            value={value!["brand"] as string[]}
            defaultValue={defaultValue.getAll("brand")}
          />
        </VerticalCollapsible>
      </Toggler>

      <Toggler
        className="w-full"
        label={"Add Series Filter"}
        defaultToggle={defaultValue.getAll("series").length > 0}
      >
        <VerticalCollapsible className="w-full">
          <label>Series</label>
          <MultipleChoiceInput
            className="flex-wrap gap-x-3"
            name={"series"}
            value={value!["series"] as string[]}
            defaultValue={defaultValue.getAll("series")}
          />
        </VerticalCollapsible>
      </Toggler>
    </>
  );
}
