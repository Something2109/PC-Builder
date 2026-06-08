import { SuffixDisplay } from "@/ui/Display";
import * as Cooler from "@/utils/part/product/Cooler";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Cooler.Summary> = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  height: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
};

export default GenericSummaryCells(
  Components,
  Cooler.AttributeLabels,
  Cooler.Summary.keyof().options
);
