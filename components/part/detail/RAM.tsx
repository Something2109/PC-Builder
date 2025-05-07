import RAM from "@/utils/interface/part/info/RAM";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<RAM.Info> = {
  speed: ({ defaultValue: value }) => (
    <UnitDisplay
      Unit={TransferSpeedUnit}
      defaultUnit="MT/s"
      defaultValue={value}
    />
  ),
  capacity: ({ defaultValue: value }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={value} />
  ),
  voltage: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="V">{value}</SuffixDisplay>
  ),
  latency: ({ defaultValue: value }) =>
    value?.map((val) => val.toString()).join(" - "),
  kit: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="stick(s)">{value}</SuffixDisplay>
  ),
  form_factor: ({ defaultValue: value }) => value,
  interface: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, RAM.Label, { strict: true });
