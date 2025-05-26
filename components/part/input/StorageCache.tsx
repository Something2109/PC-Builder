import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { UnitInput, OptionSelect } from "@/components/utils/Input";
import StorageCache from "@/utils/interface/part/info/StorageCache";
import { InternalConnectors } from "@/utils/interface/utils";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<StorageCache.Info> = {
  type: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
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

  return StorageCache.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, StorageCache.Label),
  submit
);
