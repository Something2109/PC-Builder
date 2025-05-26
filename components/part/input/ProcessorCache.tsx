import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { UnitInput } from "@/components/utils/Input";
import ProcessorCache from "@/utils/interface/part/info/ProcessorCache";
import { MemoryUnits } from "@/utils/extract/Units";

export const Components: InfoComponentObject<ProcessorCache.Info> = {
  L1_cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  L2_cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  L3_cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return ProcessorCache.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, ProcessorCache.Label),
  submit
);
