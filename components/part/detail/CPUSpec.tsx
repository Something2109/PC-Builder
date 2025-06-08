import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay } from "@/components/utils/Display";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";

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
