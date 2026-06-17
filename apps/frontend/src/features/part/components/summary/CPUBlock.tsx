import * as CPUBlock from "@/utils/part/product/CPUBlock";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<CPUBlock.Summary> = {
  socket: ({ value }) => {
    const sockets = value?.join(", ");

    return sockets && sockets?.length > 20 ? `${sockets.slice(0, 20)}...` : sockets;
  },
  plate: ({ value }) => value,
};

const Classes: Partial<Record<keyof CPUBlock.Summary, string>> = {
  socket: "lg:w-48 lg:min-w-40",
  plate: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  CPUBlock.AttributeLabels,
  CPUBlock.Summary.keyof().options,
  Classes
);
