import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import AIO from "@/utils/interface/part/product/AIO";

const Components: InfoSummaryMapping<AIO.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value?.join(", "),
  cpu_plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  AIO.AttributeLabels,
  AIO.Summary.keyof().options
);
