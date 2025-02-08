import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import HDD from "@/utils/interface/info/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<HDD.Info> = {
  rotational_speed: (props) => <Input type="number" {...props} />,
  read_speed: (props) => <Input type="number" {...props} />,
  write_speed: (props) => <Input type="number" {...props} />,
  capacity: (props) => <Input type="number" {...props} />,
  cache: (props) => <Input type="number" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.HDD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.HDD.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return HDD.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, HDD.Label, submit);
