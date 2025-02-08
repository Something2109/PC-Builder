import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import RAM from "@/utils/interface/info/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<RAM.Info> = {
  speed: (props) => <Input type="number" {...props} />,
  capacity: (props) => <Input type="number" {...props} />,
  voltage: (props) => <Input type="number" {...props} />,
  latency: (props) => <></>,
  kit: (props) => <Input type="number" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return RAM.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, RAM.Label, submit);
