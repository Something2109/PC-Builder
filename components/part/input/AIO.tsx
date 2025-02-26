import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import {
  Input,
  UnitInput,
  OptionSelect,
  SuffixInput,
} from "@/components/utils/Input";
import AIO from "@/utils/interface/info/AIO";
import { FormFactor, Material } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";
import { DetailInfo } from "@/utils/interface";
import { Infos } from "@/utils/Enum";

const Schema = DetailInfo.shape[Infos.AIO];

const Components: InfoInputMapping<AIO.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Radiator.options} {...props} />
  ),
  socket: (props) => <Input {...props} />,
  cpu_plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  radiator_width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  radiator_length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  radiator_height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pump_width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pump_length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pump_height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  pump_speed: (props) => <SuffixInput suffix="RPM" type="number" {...props} />,
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
export default GenericInputTable(Components, AIO.Label, submit);
