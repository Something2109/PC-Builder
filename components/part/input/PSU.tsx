import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import {
  Input,
  SuffixInput,
  UnitInput,
  OptionSelect,
} from "@/components/utils/Input";
import PSU from "@/utils/interface/info/PSU";
import { FormFactor } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";
import { DetailInfo } from "@/utils/interface";
import { Infos } from "@/utils/Enum";

const Schema = DetailInfo.shape[Infos.PSU];

const Components: InfoInputMapping<PSU.Info> = {
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

  return Schema.parse(raw)!;
}

export default GenericInputTable(Components, PSU.Label, submit);
