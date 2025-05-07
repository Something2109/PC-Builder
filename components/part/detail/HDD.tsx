import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import HDD from "@/utils/interface/part/info/HDD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<HDD.Info> = {
  rotational_speed: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>
  ),
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
  form_factor: ({ defaultValue: value }) => value,
  interface: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, HDD.Label, { strict: true });
