import * as CPUBlock from "@/utils/part/product/CPUBlock";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<CPUBlock.Summary> = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
};

const Classes: Partial<Record<keyof CPUBlock.Summary, string>> = {
  socket: "lg:w-56 lg:min-w-48",
  plate: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  CPUBlock.AttributeLabels,
  CPUBlock.Summary.keyof().options,
  Classes
);
