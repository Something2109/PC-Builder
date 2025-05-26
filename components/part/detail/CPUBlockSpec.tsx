import { InfoComponent, InfoComponentObject } from "../utils/Table";
import CPUBlockSpec from "@/utils/interface/part/info/CPUBlockSpec";

const Components: InfoComponentObject<CPUBlockSpec.Info> = {
  plate: ({ defaultValue }) => defaultValue,
  rgb: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, CPUBlockSpec.Label, { strict: true });
