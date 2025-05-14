import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { UnitInput } from "@/components/utils/Input";
import StoragePerformance from "@/utils/interface/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<StoragePerformance.Info> = {
  read_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
  write_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
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

  return StoragePerformance.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, StoragePerformance.Label),
  submit
);
