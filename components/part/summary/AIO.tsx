import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import AIO from "@/utils/interface/product/AIO";

const Components: InfoSummaryMapping<AIO.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  AIO.AttributeLabels,
  AIO.Summary.keyof().options
);
