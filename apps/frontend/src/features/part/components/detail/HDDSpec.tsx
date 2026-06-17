import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as HDDSpec from "@/utils/part/info/HDDSpec";
import { MemoryUnits } from "@/utils/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<HDDSpec.DTO> = {
  rotational_speed: ({ defaultValue }) => (
    <SuffixDisplay suffix="RPM">{defaultValue}</SuffixDisplay>
  ),

  capacity: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={defaultValue} />
  ),
  form_factor: ({ defaultValue }) => defaultValue,
  interface: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, HDDSpec.Label, { strict: true });
