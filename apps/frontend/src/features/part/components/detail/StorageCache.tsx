import { UnitDisplay } from "@/ui/Display";
import * as StorageCache from "@pc-builder/shared/part/info/StorageCache";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<StorageCache.DTO> = {
  type: ({ defaultValue }) => defaultValue,
  capacity: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={defaultValue} />
  ),
};

export default InfoComponent(Components, StorageCache.Label, { strict: true });
