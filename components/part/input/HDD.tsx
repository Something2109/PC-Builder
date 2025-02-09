import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import HDD from "@/utils/interface/info/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoInputMapping<HDD.Info> = {
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
  const raw = Object.fromEntries(formData.entries());

  return HDD.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, HDD.Label, submit);
