import { SuffixDisplay } from "@/ui/Display";
import * as Fan from "@pc-builder/shared/part/product/Fan";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Fan.Summary> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  bearing: ({ value }) => value,
};

const Classes: Partial<Record<keyof Fan.Summary, string>> = {
  form_factor: "lg:w-36 lg:min-w-32",
  speed: "text-right font-mono tabular-nums lg:w-32 lg:min-w-28",
  bearing: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  Fan.AttributeLabels,
  Fan.Summary.keyof().options,
  Classes
);
