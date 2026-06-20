import * as AIO from "@pc-builder/shared/part/product/AIO";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<AIO.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value?.join(", "),
  cpu_plate: ({ value }) => value,
};

const Classes: Partial<Record<keyof AIO.Summary, string>> = {
  form_factor: "lg:w-36 lg:min-w-32",
  socket: "lg:w-56 lg:min-w-48",
  cpu_plate: "lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  AIO.AttributeLabels,
  AIO.Summary.keyof().options,
  Classes
);
