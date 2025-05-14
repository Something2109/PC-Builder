import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { OptionSelect } from "@/components/utils/Input";
import CPUBlockSpec from "@/utils/interface/part/info/CPUBlockSpec";
import { InternalConnectors, Material } from "@/utils/interface/utils";

const Components: InfoComponentObject<CPUBlockSpec.Info> = {
  plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
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

  return CPUBlockSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, CPUBlockSpec.Label),
  submit
);
