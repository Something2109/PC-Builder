import CPU from "@/utils/interface/info/CPU";
import { GenericDetailTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPU.Info]: FunctionComponent<{ value: CPU.Info[key] }>;
} = {
  family: ({ value }) => value,
  socket: ({ value }) => value,
  total_cores: ({ value }) => value,
  total_threads: ({ value }) => value,
  base_frequency: ({ value }) => value,
  turbo_frequency: ({ value }) => value,
  cores: ({ value }) => value.toString(),
  L2_cache: ({ value }) => value,
  L3_cache: ({ value }) => value,
  max_memory: ({ value }) => value,
  max_memory_channel: ({ value }) => value,
  max_memory_bandwidth: ({ value }) => value,
  tdp: ({ value }) => value,
  lithography: ({ value }) => value,
};

export default GenericDetailTable(Components, CPU.Label);
