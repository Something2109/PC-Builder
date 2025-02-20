import CPUBlock from "@/utils/interface/info/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { Input, OptionSelect } from "@/components/utils/Input";
import { GenericInputTable, InfoInputMapping } from "../TableWrapper";

const Components: InfoInputMapping<CPUBlock.Info> = {
  socket: (props) => <Input {...props} />,
  plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return CPUBlock.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, CPUBlock.Label, submit);
