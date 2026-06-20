import { SuffixDisplay } from "@/ui/Display";
import * as HDD from "@pc-builder/shared/part/product/HDD";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<HDD.Summary> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
  read_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
  write_speed: ({ value }) => <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>,
};

const Classes: Partial<Record<keyof HDD.Summary, string>> = {
  capacity: "text-right font-mono tabular-nums lg:w-32 lg:min-w-28",
  read_speed: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  write_speed: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  form_factor: "lg:w-36 lg:min-w-32",
  interface: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  HDD.AttributeLabels,
  HDD.Summary.keyof().options,
  Classes
);
