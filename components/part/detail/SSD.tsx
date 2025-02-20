import { GenericDetailTable, InfoDetailMapping } from "../TableWrapper";
import { UnitDisplay } from "@/components/utils/Display";
import SSD from "@/utils/interface/info/SSD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";
import { FunctionComponent } from "react";

const Components: InfoDetailMapping<SSD.Info> = {
  memory_type: ({ value }) => value,
  read_speed: ({ value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={value}
    />
  ),
  write_speed: ({ value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={value}
    />
  ),
  capacity: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  cache: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  tbw: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="TB" defaultValue={value} />
  ),
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericDetailTable(Components, SSD.Label);
