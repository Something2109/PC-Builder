import * as SSD from "@pc-builder/shared/part/product/SSD";

import { SuffixDisplay } from "@/ui/Display";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<SSD.Summary> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  read_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
  write_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof SSD.Summary, string>> = {
  capacity: "text-right font-mono tabular-nums lg:w-32 lg:min-w-28",
  read_speed: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  write_speed: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  form_factor: "lg:w-36 lg:min-w-32",
  interface: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  SSD.AttributeLabels,
  SSD.Summary.keyof().options,
  Classes
);
