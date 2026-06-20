import { ZodType } from "zod";

import { UnitInput, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@pc-builder/shared/interface";
import * as StorageCache from "@pc-builder/shared/part/info/StorageCache";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<StorageCache.DTO> = {
  type: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  capacity: ({ form: _, ...props }) => <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />,
};

export default GenericSingleInputForm<StorageCache.DTO>(
  Components,
  StorageCache.Label,
  StorageCache.Schemas.DTO as ZodType<StorageCache.DTO, StorageCache.DTO>
);
