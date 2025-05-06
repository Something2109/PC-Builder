import CPUBlock from "@/utils/interface/part/info/CPUBlock";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUBlock.Info> = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default InfoComponent(Components, CPUBlock.Label, { strict: true });
