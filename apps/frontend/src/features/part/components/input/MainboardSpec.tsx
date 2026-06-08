import { ZodType } from "zod";

import { Input, SuffixInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as MainboardSpec from "@/utils/part/info/MainboardSpec";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<MainboardSpec.DTO> = {
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.Mainboard.options} {...props} />
  ),
  socket: ({ form: _, ...props }) => <Input {...props} />,
  chipset: ({ form: _, ...props }) => <Input {...props} />,
  ram_form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  ram_interface: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  ram_slot: ({ form: _, ...props }) => (
    <SuffixInput suffix="slot(s)" type="number" {...props} />
  ),
};

export default GenericSingleInputForm<MainboardSpec.DTO>(
  Components,
  MainboardSpec.Label,
  MainboardSpec.Schemas.DTO as ZodType<MainboardSpec.DTO, MainboardSpec.DTO>
);
