import { SuffixDisplay } from "@/ui/Display";
import * as RAM from "@/utils/part/product/RAM";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<RAM.Summary> = {
  speed: ({ value }) => <SuffixDisplay suffix="MT/s">{value}</SuffixDisplay>,
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof RAM.Summary, string>> = {
  speed: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  capacity: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  form_factor: "lg:w-32 lg:min-w-24",
  interface: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  RAM.AttributeLabels,
  RAM.Summary.keyof().options,
  Classes
);
