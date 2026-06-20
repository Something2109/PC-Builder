import { UnitDisplay } from "@/ui/Display";
import * as SSDSpec from "@pc-builder/shared/part/info/SSDSpec";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<SSDSpec.DTO> = {
  memory_type: ({ defaultValue }) => defaultValue,
  capacity: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={defaultValue} />
  ),
  tbw: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="TB" defaultValue={defaultValue} />
  ),
  form_factor: ({ defaultValue }) => defaultValue,
  interface: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, SSDSpec.Label, { strict: true });
