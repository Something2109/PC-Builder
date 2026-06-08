import { UnitInput } from "@/ui/Input";
import * as StoragePerformance from "@/utils/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<StoragePerformance.DTO> = {
  read_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
  write_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
};

function submit(formData: FormData) {
  return StoragePerformance.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, StoragePerformance.Label),
  submit
);
