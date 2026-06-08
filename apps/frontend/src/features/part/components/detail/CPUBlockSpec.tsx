import * as CPUBlockSpec from "@/utils/part/info/CPUBlockSpec";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUBlockSpec.DTO> = {
  plate: ({ defaultValue }) => defaultValue,
  rgb: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, CPUBlockSpec.Label, { strict: true });
