import { SuffixDisplay } from "@/ui/Display";
import * as Fan from "@/utils/part/product/Fan";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Fan.Summary> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  bearing: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Fan.AttributeLabels,
  Fan.Summary.keyof().options
);
