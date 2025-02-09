import { GenericDetailTable } from "../TableWrapper";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import HDD from "@/utils/interface/info/HDD";
import { MemorySpeedUnit, MemoryUnits } from "@/utils/extract/Units";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof HDD.Info]: FunctionComponent<{ value: HDD.Info[key] }>;
} = {
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

export default GenericDetailTable(Components, HDD.Label);
