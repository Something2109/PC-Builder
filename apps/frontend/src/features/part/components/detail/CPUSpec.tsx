import { SuffixDisplay } from "@/ui/Display";
import * as CPUSpec from "@/utils/part/info/CPUSpec";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUSpec.DTO> = {
  family: ({ defaultValue }) => defaultValue,
  socket: ({ defaultValue }) => defaultValue,
  total_cores: ({ defaultValue }) => (
    <SuffixDisplay suffix="Cores">{defaultValue}</SuffixDisplay>
  ),
  total_threads: ({ defaultValue }) => (
    <SuffixDisplay suffix="Threads">{defaultValue}</SuffixDisplay>
  ),
  lithography: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, CPUSpec.Label, { strict: true });
