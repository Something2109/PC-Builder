import { SuffixDisplay } from "@/ui/Display";
import * as GPU from "@/utils/part/product/GPU";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<GPU.Summary> = {
  core_count: ({ value }) => value,
  base_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  boost_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  memory_size: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
};

const Classes: Partial<Record<keyof GPU.Summary, string>> = {
  core_count: "text-center font-mono tabular-nums lg:w-36 lg:min-w-32",
  base_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  boost_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  memory_size: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  tdp: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  GPU.AttributeLabels,
  GPU.Summary.keyof().options,
  Classes
);
