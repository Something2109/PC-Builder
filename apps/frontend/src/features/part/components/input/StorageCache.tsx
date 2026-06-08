import { UnitInput, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as StorageCache from "@/utils/part/info/StorageCache";
import { MemoryUnits } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

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
