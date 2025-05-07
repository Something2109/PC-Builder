import CPUBlock from "@/utils/interface/part/info/CPUBlock";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUBlock.Info> = {
  socket: ({ defaultValue: value }) => value?.join(", "),
  plate: ({ defaultValue: value }) => value,
  rgb: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, CPUBlock.Label, { strict: true });
