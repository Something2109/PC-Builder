import RAM from "@/utils/interface/info/RAM";
import { FunctionComponent } from "react";
import { GenericDetailTable } from "../TableWrapper";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/extract/Units";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value: RAM.Info[key] }>;
} = {
  speed: ({ value }) => (
    <UnitDisplay
      Unit={TransferSpeedUnit}
      defaultUnit="mm"
      defaultValue={value}
    />
  ),
  capacity: ({ value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  voltage: ({ value }) => <SuffixDisplay suffix="V">{value}</SuffixDisplay>,
  latency: ({ value }) => value.map((val) => val.toString()).join(" - "),
  kit: ({ value }) => <SuffixDisplay suffix="stick(s)">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericDetailTable(Components, RAM.Label);
