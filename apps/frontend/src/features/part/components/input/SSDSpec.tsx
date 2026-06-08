import { ZodType } from "zod";

import { UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as SSDSpec from "@/utils/part/info/SSDSpec";
import { MemoryUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<SSDSpec.DTO> = {
  memory_type: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={SSDSpec.MemoryCell.options} {...props} />
  ),
  capacity: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  tbw: ({ form: _, ...props }) => <UnitInput Unit={MemoryUnits} defaultUnit="TB" {...props} />,
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.SSD.options} {...props} />
  ),
  interface: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.Storage.SSD.options} {...props} />
  ),
};

export default GenericSingleInputForm<SSDSpec.DTO>(
  Components,
  SSDSpec.Label,
  SSDSpec.Schemas.DTO as ZodType<SSDSpec.DTO, SSDSpec.DTO>
);
