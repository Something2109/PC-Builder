import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import HDD from "@/utils/interface/part/info/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<HDD.Info> = {
  rotational_speed: (props) => (
    <SuffixInput suffix="RPM" type="number" {...props} />
  ),
  read_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
  write_speed: (props) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  cache: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.HDD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.HDD.options} {...props} />
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

  return HDD.Schema.parse(raw)!;
}

export default GenericInputField(InfoComponent(Components, HDD.Label), submit);
