import { ZodType } from "zod";

import { UnitInput, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as StorageCache from "@/utils/part/info/StorageCache";
import { MemoryUnits } from "@/utils/Units";

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
