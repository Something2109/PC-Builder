import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { UnitInput, OptionSelect } from "@/components/utils/Input";
import StorageCache from "@/utils/interface/part/info/StorageCache";
import { InternalConnectors } from "@/utils/interface/utils";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<StorageCache.DTO> = {
  type: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
};

function submit(formData: FormData) {
  return StorageCache.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, StorageCache.Label),
  submit
);
