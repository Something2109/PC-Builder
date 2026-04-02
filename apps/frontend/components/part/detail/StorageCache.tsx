import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import * as StorageCache from "@/utils/part/info/StorageCache";
import { MemoryUnits } from "@/utils/Units";

const Components: InfoComponentObject<StorageCache.DTO> = {
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
