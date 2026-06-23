import * as HDDSpec from "@pc-builder/shared/part/info/HDDSpec";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { SuffixDisplay, UnitDisplay } from "@/ui/Display";

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
