import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, UnitInput, OptionSelect } from "@/components/utils/Input";
import Cooler from "@/utils/interface/info/Cooler";
import { Material } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";
import { DetailInfo } from "@/utils/interface";
import { Infos } from "@/utils/Enum";

const Schema = DetailInfo.shape[Infos.COOLER];

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
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return Schema.parse(raw)!;
}
export default GenericInputTable(Components, Cooler.Label, submit);
