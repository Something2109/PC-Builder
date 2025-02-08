import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Fan from "@/utils/interface/info/Fan";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<Fan.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Fan.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  count: (props) => <Input type="number" {...props} />,
  voltage: (props) => <Input type="number" {...props} />,
  speed: (props) => <Input type="number" {...props} />,
  airflow: (props) => <Input type="number" {...props} />,
  noise: (props) => <Input type="number" {...props} />,
  static_pressure: (props) => <Input type="number" {...props} />,
  bearing: (props) => <OptionSelect options={Fan.Bearing.options} {...props} />,
  connector: (props) => (
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

  return Fan.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Fan.Label, submit);
