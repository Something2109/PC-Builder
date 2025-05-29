import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
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
  return ProcessorCache.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, ProcessorCache.Label),
  submit
);
