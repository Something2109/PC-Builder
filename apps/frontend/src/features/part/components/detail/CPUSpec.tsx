import * as CPUSpec from "@pc-builder/shared/part/info/CPUSpec";

import { SuffixDisplay } from "@/ui/Display";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUSpec.DTO> = {
  family: ({ defaultValue }) => defaultValue,
  socket: ({ defaultValue }) => defaultValue,
  total_cores: ({ defaultValue }) => <SuffixDisplay suffix="Cores">{defaultValue}</SuffixDisplay>,
  total_threads: ({ defaultValue }) => (
    <SuffixDisplay suffix="Threads">{defaultValue}</SuffixDisplay>
  ),
  lithography: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, CPUSpec.Label, { strict: true });
