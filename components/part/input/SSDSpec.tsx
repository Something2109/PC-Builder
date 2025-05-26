import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { UnitInput, OptionSelect } from "@/components/utils/Input";
import SSDSpec from "@/utils/interface/part/info/SSDSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<SSDSpec.Info> = {
  memory_type: (props) => (
    <OptionSelect options={SSDSpec.MemoryCell.options} {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  tbw: (props) => <UnitInput Unit={MemoryUnits} defaultUnit="TB" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.SSD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.SSD.options} {...props} />
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

  return SSDSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, SSDSpec.Label),
  submit
);
