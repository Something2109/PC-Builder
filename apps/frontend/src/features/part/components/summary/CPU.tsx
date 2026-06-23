import * as CPU from "@pc-builder/shared/part/product/CPU";

import { SuffixDisplay } from "@/ui/Display";

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
  socket: "lg:w-32 lg:min-w-24",
  total_cores: "text-center font-mono tabular-nums lg:w-36 lg:min-w-32",
  total_threads: "text-center font-mono tabular-nums lg:w-36 lg:min-w-32",
  base_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  turbo_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  tdp: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  CPU.AttributeLabels,
  CPU.Summary.keyof().options,
  Classes
);
