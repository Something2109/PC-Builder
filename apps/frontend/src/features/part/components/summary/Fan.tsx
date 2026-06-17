import { SuffixDisplay } from "@/ui/Display";
import * as Fan from "@/utils/part/product/Fan";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Fan.Summary> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  bearing: ({ value }) => value,
};

const Classes: Partial<Record<keyof Fan.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  speed: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  bearing: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  Fan.AttributeLabels,
  Fan.Summary.keyof().options,
  Classes
);
