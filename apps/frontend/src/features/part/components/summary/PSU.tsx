import { SuffixDisplay } from "@/ui/Display";
import * as PSU from "@/utils/part/product/PSU";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<PSU.Summary> = {
  wattage: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  efficiency: ({ value }) => value,
  form_factor: ({ value }) => value,
  modular: ({ value }) => value,
};

const Classes: Partial<Record<keyof PSU.Summary, string>> = {
  wattage: "text-right font-mono tabular-nums lg:w-24 lg:min-w-20",
  efficiency: "lg:w-32 lg:min-w-24",
  form_factor: "lg:w-32 lg:min-w-24",
  modular: "lg:w-28 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  PSU.AttributeLabels,
  PSU.Summary.keyof().options,
  Classes
);
