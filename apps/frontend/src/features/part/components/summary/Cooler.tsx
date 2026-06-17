import { SuffixDisplay } from "@/ui/Display";
import * as Cooler from "@/utils/part/product/Cooler";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Cooler.Summary> = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  height: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
};

const Classes: Partial<Record<keyof Cooler.Summary, string>> = {
  socket: "lg:w-32 lg:min-w-24",
  cpu_plate: "lg:w-32 lg:min-w-24",
  height: "text-right font-mono tabular-nums lg:w-24 lg:min-w-20",
};

export default GenericSummaryCells(
  Components,
  Cooler.AttributeLabels,
  Cooler.Summary.keyof().options,
  Classes
);
