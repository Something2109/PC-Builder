import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/ui/Display";
import * as SSDSpec from "@/utils/part/info/SSDSpec";
import { MemoryUnits } from "@/utils/Units";

const Components: InfoComponentObject<SSDSpec.DTO> = {
  memory_type: ({ defaultValue }) => defaultValue,
  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
  tbw: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="TB"
      defaultValue={defaultValue}
    />
  ),
  form_factor: ({ defaultValue }) => defaultValue,
  interface: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, SSDSpec.Label, { strict: true });
