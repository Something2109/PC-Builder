import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { UnitInput } from "@/components/utils/Input";
import StoragePerformance from "@/utils/interface/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@/utils/extract/Units";

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
