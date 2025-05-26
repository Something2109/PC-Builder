import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import HDDSpec from "@/utils/interface/part/info/HDDSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<HDDSpec.Info> = {
  rotational_speed: (props) => (
    <SuffixInput suffix="RPM" type="number" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.HDD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.HDD.options} {...props} />
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

  return HDDSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, HDDSpec.Label),
  submit
);
