import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Cooler from "@/utils/interface/info/Cooler";
import { Material } from "@/utils/interface/utils";

const Components: InfoInputMapping<Cooler.Info> = {
  socket: (props) => <Input {...props} />,
  cpu_plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Cooler.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, Cooler.Label, submit);
