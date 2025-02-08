import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import PSU from "@/utils/interface/info/PSU";
import { FormFactor } from "@/utils/interface/utils";

const Components: InfoInputMapping<PSU.Info> = {
  wattage: (props) => <Input type="number" {...props} />,
  efficiency: (props) => (
    <OptionSelect options={PSU.Efficiency.options} {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.PSU.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  modular: (props) => <OptionSelect options={PSU.Modular.options} {...props} />,
  atx_pin: (props) => <Input type="number" {...props} />,
  cpu_pin: (props) => <Input type="number" {...props} />,
  pcie_pin: (props) => <Input type="number" {...props} />,
  sata_pin: (props) => <Input type="number" {...props} />,
  peripheral_pin: (props) => <Input type="number" {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return PSU.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, PSU.Label, submit);
