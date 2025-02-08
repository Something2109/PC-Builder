import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import AIO from "@/utils/interface/info/AIO";
import { FormFactor, Material } from "@/utils/interface/utils";

const Components: InfoInputMapping<AIO.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Radiator.options} {...props} />
  ),
  socket: (props) => <Input {...props} />,
  cpu_plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  radiator_width: (props) => <Input type="number" step="0.01" {...props} />,
  radiator_length: (props) => <Input type="number" step="0.01" {...props} />,
  radiator_height: (props) => <Input type="number" step="0.01" {...props} />,
  pump_width: (props) => <Input type="number" step="0.01" {...props} />,
  pump_length: (props) => <Input type="number" step="0.01" {...props} />,
  pump_height: (props) => <Input type="number" step="0.01" {...props} />,
  pump_speed: (props) => <Input type="number" step="0.01" {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return AIO.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, AIO.Label, submit);
