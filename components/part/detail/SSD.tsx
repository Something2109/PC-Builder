import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import SSD from "@/utils/interface/part/info/SSD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<SSD.Info> = {
  memory_type: ({ defaultValue: value }) => value,
  read_speed: ({ defaultValue: value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={value}
    />
  ),
  write_speed: ({ defaultValue: value }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={value}
    />
  ),
  capacity: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  cache: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={value} />
  ),
  tbw: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="TB" defaultValue={value} />
  ),
  form_factor: ({ defaultValue: value }) => value,
  interface: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, SSD.Label, { strict: true });
