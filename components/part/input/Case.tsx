import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, UnitInput, OptionSelect } from "@/components/utils/Input";
import Case from "@/utils/interface/info/Case";
import { FormFactor } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoInputMapping<Case.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Case.options} {...props} />
  ),
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  mainboard_support: (props) => <></>,
  expansion_slot: (props) => <Input type="number" {...props} />,
  max_cooler_height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  radiator_support: (props) => <></>,
  fan_support: (props) => <></>,
  hard_drive_support: (props) => <></>,
  psu_support: (props) => <></>,
  max_psu_length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  front_panel_ports: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Case.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, Case.Label, submit);
