import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import RAMSpec from "@/utils/interface/part/info/RAMSpec";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<RAMSpec.DTO> = {
  speed: ({ defaultValue }) => (
    <UnitDisplay
      Unit={TransferSpeedUnit}
      defaultUnit="MT/s"
      defaultValue={defaultValue}
    />
  ),
  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
  voltage: ({ defaultValue }) => (
    <SuffixDisplay suffix="V">{defaultValue}</SuffixDisplay>
  ),
  latency: ({ defaultValue }) =>
    defaultValue?.map((val) => val.toString()).join(" - "),
  kit: ({ defaultValue }) => (
    <SuffixDisplay suffix="stick(s)">{defaultValue}</SuffixDisplay>
  ),
  form_factor: ({ defaultValue }) => defaultValue,
  interface: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, RAMSpec.Label, { strict: true });
