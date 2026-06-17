import { SuffixDisplay } from "@/ui/Display";
import * as SSD from "@/utils/part/product/SSD";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<SSD.Summary> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  read_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
  write_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof SSD.Summary, string>> = {
  capacity: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  read_speed: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  write_speed: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  form_factor: "lg:w-32 lg:min-w-24",
  interface: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  SSD.AttributeLabels,
  SSD.Summary.keyof().options,
  Classes
);
