import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/extract/Units";
import RAM from "@/utils/interface/info/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<RAM.Info> = {
  speed: (props) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="mm" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  voltage: (props) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  latency: (props) => <></>,
  kit: (props) => (
    <SuffixInput suffix="stick(s)" type="number" step={0.01} {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return RAM.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, RAM.Label, submit);
