import { ZodType } from "zod";

import { Input, SuffixInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@pc-builder/shared/interface";
import * as MainboardSpec from "@pc-builder/shared/part/info/MainboardSpec";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<MainboardSpec.DTO> = {
  form_factor: (field) => (
    <OptionSelect options={FormFactor.Mainboard.options} {...mapChange(field, "select")} />
  ),
  socket: (field) => <Input {...mapChange(field, "string")} />,
  chipset: (field) => <Input {...mapChange(field, "string")} />,
  ram_form_factor: (field) => (
    <OptionSelect options={FormFactor.RAM.options} {...mapChange(field, "select")} />
  ),
  ram_interface: (field) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...mapChange(field, "select")} />
  ),
  ram_slot: (field) => (
    <SuffixInput suffix="slot(s)" type="number" {...mapChange(field, "number")} />
  ),
};

export default GenericSingleInputForm<MainboardSpec.DTO>(
  Components,
  MainboardSpec.Label,
  MainboardSpec.Schemas.DTO as ZodType<MainboardSpec.DTO, MainboardSpec.DTO>
);
