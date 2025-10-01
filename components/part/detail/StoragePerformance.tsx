import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import StoragePerformance from "@/utils/interface/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<StoragePerformance.DTO> = {
  read_speed: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={defaultValue}
    />
  ),
  write_speed: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="MB/s"
      defaultValue={defaultValue}
    />
  ),
};

export default InfoComponent(Components, StoragePerformance.Label, {
  strict: true,
});
