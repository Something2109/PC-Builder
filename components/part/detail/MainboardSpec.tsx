import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay } from "@/components/utils/Display";
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";

const Components: InfoComponentObject<MainboardSpec.Info> = {
  form_factor: ({ defaultValue }) => defaultValue,
  socket: ({ defaultValue }) => defaultValue,
  chipset: ({ defaultValue }) => defaultValue,
  ram_form_factor: ({ defaultValue }) => defaultValue,
  ram_interface: ({ defaultValue }) => defaultValue,
  ram_slot: ({ defaultValue }) => (
    <SuffixDisplay suffix="slot(s)">{defaultValue}</SuffixDisplay>
  ),
  miscelanous_connectors: ({ defaultValue }) =>
    Object.entries(defaultValue ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
};

export default InfoComponent(Components, MainboardSpec.Label, { strict: true });
