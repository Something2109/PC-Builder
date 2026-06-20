import { ZodType } from "zod";

import { UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@pc-builder/shared/interface";
import * as SSDSpec from "@pc-builder/shared/part/info/SSDSpec";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<SSDSpec.DTO> = {
  memory_type: (field) => (
    <OptionSelect options={SSDSpec.MemoryCell.options} {...mapChange(field, "select")} />
  ),
  capacity: (field) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...mapChange(field, "number")} />
  ),
  tbw: (field) => <UnitInput Unit={MemoryUnits} defaultUnit="TB" {...mapChange(field, "number")} />,
  form_factor: (field) => (
    <OptionSelect options={FormFactor.SSD.options} {...mapChange(field, "select")} />
  ),
  interface: (field) => (
    <OptionSelect
      options={InternalConnectors.Storage.SSD.options}
      {...mapChange(field, "select")}
    />
  ),
};

export default GenericSingleInputForm<SSDSpec.DTO>(
  Components,
  SSDSpec.Label,
  SSDSpec.Schemas.DTO as ZodType<SSDSpec.DTO, SSDSpec.DTO>
);
