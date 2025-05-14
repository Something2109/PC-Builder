import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import StorageCache from "@/utils/interface/part/info/StorageCache";
import { MemoryUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<StorageCache.Info> = {
  type: ({ defaultValue }) => defaultValue,
  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
};

export default InfoComponent(Components, StorageCache.Label, { strict: true });
