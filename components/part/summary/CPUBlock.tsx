import CPUBlock from "@/utils/interface/part/product/CPUBlock";
import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<CPUBlock.Summary> = {
  socket: ({ value }) => {
    const sockets = value?.join(", ");

    return sockets && sockets?.length > 20
      ? `${sockets.slice(0, 20)}...`
      : sockets;
  },
  plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  CPUBlock.AttributeLabels,
  CPUBlock.Summary.keyof().options
);
