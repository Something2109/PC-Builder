import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, UnitInput, OptionSelect } from "@/components/utils/Input";
import Radiator from "@/utils/interface/info/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoInputMapping<Radiator.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Radiator.options} {...props} />
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
