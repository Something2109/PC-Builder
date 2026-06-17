import * as AIO from "@/utils/part/product/AIO";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<AIO.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value?.join(", "),
  cpu_plate: ({ value }) => value,
};

const Classes: Partial<Record<keyof AIO.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  socket: "lg:w-48 lg:min-w-40",
  cpu_plate: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  AIO.AttributeLabels,
  AIO.Summary.keyof().options,
  Classes
);
