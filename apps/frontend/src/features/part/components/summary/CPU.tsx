import { SuffixDisplay } from "@/ui/Display";
import * as CPU from "@/utils/part/product/CPU";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<CPU.Summary> = {
  socket: ({ value }) => value,
  total_cores: ({ value }) => value,
  total_threads: ({ value }) => value,
  base_frequency: ({ value }) => <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>,
  turbo_frequency: ({ value }) => <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>,
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
};

const Classes: Partial<Record<keyof CPU.Summary, string>> = {
  total_cores: "text-center font-mono tabular-nums lg:w-24 lg:min-w-20",
  total_threads: "text-center font-mono tabular-nums lg:w-24 lg:min-w-20",
  base_frequency: "text-right font-mono tabular-nums lg:w-32 lg:min-w-24",
  turbo_frequency: "text-right font-mono tabular-nums lg:w-32 lg:min-w-24",
  tdp: "text-right font-mono tabular-nums lg:w-24 lg:min-w-20",
};

export default GenericSummaryCells(
  Components,
  CPU.AttributeLabels,
  CPU.Summary.keyof().options,
  Classes
);
