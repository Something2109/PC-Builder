import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, UnitInput, OptionSelect } from "@/components/utils/Input";
import Cooler from "@/utils/interface/info/Cooler";
import { Material } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoInputMapping<Cooler.Info> = {
  socket: (props) => <Input {...props} />,
  cpu_plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
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
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Cooler.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, Cooler.Label, submit);
