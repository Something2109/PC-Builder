import { SuffixDisplay } from "@/ui/Display";
import * as RAM from "@/utils/part/product/RAM";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<RAM.Summary> = {
  speed: ({ value }) => <SuffixDisplay suffix="MT/s">{value}</SuffixDisplay>,
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  RAM.AttributeLabels,
  RAM.Summary.keyof().options
);
