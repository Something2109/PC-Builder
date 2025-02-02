import { GenericSummaryCells } from "../TableWrapper";
import GPU from "@/utils/interface/part/GPU";
import { FunctionComponent } from "react";

const Components: {
  [key in GPU.Summarizable]: FunctionComponent<{ value?: GPU.Info[key] }>;
} = {
  core_count: ({ value }) => value,
  base_frequency: ({ value }) => value,
  boost_frequency: ({ value }) => value,
  memory_size: ({ value }) => value,
  tdp: ({ value }) => value,
};

export default GenericSummaryCells(Components, GPU.Label);
