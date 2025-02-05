import { GenericDetailTable } from "../TableWrapper";
import GPU from "@/utils/interface/info/GPU";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GPU.Info]: FunctionComponent<{ value: GPU.Info[key] }>;
} = {
  family: ({ value }) => value,
  core_count: ({ value }) => value,
  execution_unit: ({ value }) => value,
  base_frequency: ({ value }) => value,
  boost_frequency: ({ value }) => value,
  extra_cores: ({ value }) => value.toString(),
  memory_size: ({ value }) => value,
  memory_type: ({ value }) => value.toString(),
  memory_bus: ({ value }) => value,
  tdp: ({ value }) => value,
  features: ({ value }) => value.toString(),
};

export default GenericDetailTable(Components, GPU.Label);
