import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import SSD from "@/utils/interface/info/SSD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<SSD.Info> = {
  memory_type: (props) => (
    <OptionSelect options={SSD.MemoryCell.options} {...props} />
  ),
  read_speed: (props) => <Input type="number" {...props} />,
  write_speed: (props) => <Input type="number" {...props} />,
  capacity: (props) => <Input type="number" {...props} />,
  cache: (props) => <Input type="number" {...props} />,
  tbw: (props) => <Input type="number" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.SSD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.SSD.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return raw;
}

export default GenericInputTable(Components, SSD.Label, submit);
