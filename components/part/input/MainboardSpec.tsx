import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { Input, SuffixInput, OptionSelect } from "@/components/utils/Input";
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoComponentObject<MainboardSpec.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Mainboard.options} {...props} />
  ),
  socket: (props) => <Input {...props} />,
  chipset: (props) => <Input {...props} />,
  ram_form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  ram_interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  ram_slot: (props) => (
    <SuffixInput suffix="slot(s)" type="number" {...props} />
  ),
  miscelanous_connectors: (props) => <></>,
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

  return MainboardSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, MainboardSpec.Label),
  submit
);
