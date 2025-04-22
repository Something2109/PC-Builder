import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { UnitInput, OptionSelect } from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import SSD from "@/utils/interface/part/info/SSD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";
import { Infos } from "@/utils/Enum";

const Schema = Part.Detail.shape[Infos.SSD];

const Components: InfoInputMapping<SSD.Info> = {
  memory_type: (props) => (
    <OptionSelect options={SSD.MemoryCell.options} {...props} />
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
  tbw: (props) => <UnitInput Unit={MemoryUnits} defaultUnit="TB" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.SSD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.SSD.options} {...props} />
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

export default GenericInputTable(Components, SSD.Label, submit);
