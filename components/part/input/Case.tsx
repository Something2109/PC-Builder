import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Case from "@/utils/interface/info/Case";
import { FormFactor } from "@/utils/interface/utils";

const Components: InfoInputMapping<Case.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Case.options} {...props} />
  ),
  width: (props) => <Input type="number" step="0.01" {...props} />,
  length: (props) => <Input type="number" step="0.01" {...props} />,
  height: (props) => <Input type="number" step="0.01" {...props} />,
  mainboard_support: (props) => <></>,
  expansion_slot: (props) => <Input type="number" {...props} />,
  max_cooler_height: (props) => <Input type="number" {...props} />,
  radiator_support: (props) => <></>,
  fan_support: (props) => <></>,
  hard_drive_support: (props) => <></>,
  psu_support: (props) => <></>,
  max_psu_length: (props) => <Input type="number" {...props} />,
  front_panel_ports: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Case.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, Case.Label, submit);
