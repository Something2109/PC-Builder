import * as PSU from "@pc-builder/shared/part/product/PSU";

import { SuffixDisplay } from "@/ui/Display";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<PSU.Summary> = {
  wattage: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  efficiency: ({ value }) => value,
  form_factor: ({ value }) => value,
  modular: ({ value }) => value,
};

const Classes: Partial<Record<keyof PSU.Summary, string>> = {
  wattage: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  efficiency: "lg:w-36 lg:min-w-32",
  form_factor: "lg:w-36 lg:min-w-32",
  modular: "lg:w-32 lg:min-w-28",
};

export default GenericSummaryCells(
  Components,
  PSU.AttributeLabels,
  PSU.Summary.keyof().options,
  Classes
);
