import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import ProcessorCache from "@/utils/interface/part/info/ProcessorCache";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<ProcessorCache.DTO> = {
  L1_cache: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={defaultValue}
    />
  ),
  L2_cache: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={defaultValue}
    />
  ),
  L3_cache: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={defaultValue}
    />
  ),
};

export default InfoComponent(Components, ProcessorCache.Label, {
  strict: true,
});
