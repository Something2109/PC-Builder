import { SuffixDisplay } from "@/ui/Display";
import * as Cooler from "@/utils/part/product/Cooler";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Cooler.Summary> = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  height: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
};

const Classes: Partial<Record<keyof Cooler.Summary, string>> = {
  socket: "lg:w-36 lg:min-w-32",
  cpu_plate: "lg:w-36 lg:min-w-32",
  height: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  Cooler.AttributeLabels,
  Cooler.Summary.keyof().options,
  Classes
);
