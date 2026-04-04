import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay } from "@/ui/Display";
import * as MainboardSpec from "@/utils/part/info/MainboardSpec";

const Components: InfoComponentObject<MainboardSpec.DTO> = {
  form_factor: ({ defaultValue }) => defaultValue,
  socket: ({ defaultValue }) => defaultValue,
  chipset: ({ defaultValue }) => defaultValue,
  ram_form_factor: ({ defaultValue }) => defaultValue,
  ram_interface: ({ defaultValue }) => defaultValue,
  ram_slot: ({ defaultValue }) => (
    <SuffixDisplay suffix="slot(s)">{defaultValue}</SuffixDisplay>
  ),
};

export default InfoComponent(Components, MainboardSpec.Label, { strict: true });
