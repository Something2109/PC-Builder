import { UnitDisplay } from "@/ui/Display";
import * as StoragePerformance from "@pc-builder/shared/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<StoragePerformance.DTO> = {
  read_speed: ({ defaultValue }) => (
    <UnitDisplay Unit={MemorySpeedUnit} defaultUnit="MB/s" defaultValue={defaultValue} />
  ),
  write_speed: ({ defaultValue }) => (
    <UnitDisplay Unit={MemorySpeedUnit} defaultUnit="MB/s" defaultValue={defaultValue} />
  ),
};

export default InfoComponent(Components, StoragePerformance.Label, {
  strict: true,
});
