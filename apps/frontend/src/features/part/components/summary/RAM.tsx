import * as RAM from "@pc-builder/shared/part/product/RAM";

import { SuffixDisplay } from "@/ui/Display";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<RAM.Summary> = {
  speed: ({ value }) => <SuffixDisplay suffix="MT/s">{value}</SuffixDisplay>,
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof RAM.Summary, string>> = {
  speed: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  capacity: "text-right font-mono tabular-nums lg:w-32 lg:min-w-28",
  form_factor: "lg:w-36 lg:min-w-32",
  interface: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  RAM.AttributeLabels,
  RAM.Summary.keyof().options,
  Classes
);
