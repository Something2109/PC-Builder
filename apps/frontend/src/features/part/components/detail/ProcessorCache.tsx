import * as ProcessorCache from "@pc-builder/shared/part/info/ProcessorCache";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { UnitDisplay } from "@/ui/Display";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<ProcessorCache.DTO> = {
  L1_cache: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={defaultValue} />
  ),
  L2_cache: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={defaultValue} />
  ),
  L3_cache: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="MB" defaultValue={defaultValue} />
  ),
};

export default InfoComponent(Components, ProcessorCache.Label, {
  strict: true,
});
