import CPUBlock from "@/utils/interface/info/CPUBlock";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";

const Components: InfoSummaryMapping<CPUBlock.Info, CPUBlock.Summarizable> = {
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
  CPUBlock.Label,
  CPUBlock.SummaryAttributes
);
