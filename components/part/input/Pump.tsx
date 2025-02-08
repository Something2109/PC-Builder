import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Pump from "@/utils/interface/info/Pump";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<Pump.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Pump.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  voltage: (props) => <Input type="number" {...props} />,
  wattage: (props) => <Input type="number" {...props} />,
  head_pressure: (props) => <Input type="number" {...props} />,
  flow_rate: (props) => <Input type="number" {...props} />,
  power_connector: (props) => (
    <OptionSelect
      options={InternalConnectors.Power.Miscellanous.options}
      {...props}
    />
  ),
  control_connector: (props) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...props}
    />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Pump.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Pump.Label, submit);
