import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import SSDSpec from "@/utils/interface/part/info/SSDSpec";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<SSDSpec.Info> = {
  memory_type: ({ defaultValue }) => defaultValue,
  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
  cache: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="MB"
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
