import * as AIO from "@/utils/part/product/AIO";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

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
