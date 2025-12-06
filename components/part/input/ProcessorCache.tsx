import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { UnitInput } from "@/components/utils/Input";
import * as ProcessorCache from "@/utils/part/info/ProcessorCache";
import { MemoryUnits } from "@/utils/Units";

export const Components: InfoComponentObject<ProcessorCache.DTO> = {
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
  return ProcessorCache.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, ProcessorCache.Label),
  submit
);
