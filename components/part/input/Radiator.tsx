import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Radiator from "@/utils/interface/info/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";

const Components: InfoInputMapping<Radiator.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Pump.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  fpi: (props) => <Input type="number" {...props} />,
  material: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Radiator.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Radiator.Label, submit);
