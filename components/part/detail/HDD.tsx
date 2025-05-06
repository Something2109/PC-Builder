import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import HDD from "@/utils/interface/part/info/HDD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<HDD.Info> = {
  rotational_speed: ({ value }) => (
    <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>
  ),
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
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default InfoComponent(Components, HDD.Label, { strict: true });
