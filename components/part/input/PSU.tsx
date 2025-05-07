import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import {
  Input,
  SuffixInput,
  UnitInput,
  OptionSelect,
} from "@/components/utils/Input";
import PSU from "@/utils/interface/part/info/PSU";
import { FormFactor } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<PSU.Info> = {
  wattage: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  efficiency: (props) => (
    <OptionSelect options={PSU.Efficiency.options} {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.PSU.options} {...props} />
  ),
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  modular: (props) => <OptionSelect options={PSU.Modular.options} {...props} />,
  atx_pin: (props) => <Input type="number" {...props} />,
  cpu_pin: (props) => <Input type="number" {...props} />,
  pcie_pin: (props) => <Input type="number" {...props} />,
  sata_pin: (props) => <Input type="number" {...props} />,
  peripheral_pin: (props) => <Input type="number" {...props} />,
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

  return PSU.Schema.parse(raw)!;
}

export default GenericInputField(InfoComponent(Components, PSU.Label), submit);
