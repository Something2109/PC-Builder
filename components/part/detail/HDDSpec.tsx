import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import HDDSpec from "@/utils/interface/part/info/HDDSpec";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<HDDSpec.Info> = {
  rotational_speed: ({ defaultValue }) => (
    <SuffixDisplay suffix="RPM">{defaultValue}</SuffixDisplay>
  ),

  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
  form_factor: ({ defaultValue }) => defaultValue,
  interface: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, HDDSpec.Label, { strict: true });
