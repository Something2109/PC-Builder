import * as Mainboard from "@pc-builder/shared/part/product/Mainboard";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Mainboard.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  ram_form_factor: ({ value }) => value,
  ram_interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof Mainboard.Summary, string>> = {
  form_factor: "lg:w-36 lg:min-w-32",
  socket: "lg:w-36 lg:min-w-32",
  ram_form_factor: "lg:w-40 lg:min-w-36",
  ram_interface: "lg:w-40 lg:min-w-36",
};

export default GenericSummaryCells(
  Components,
  Mainboard.AttributeLabels,
  Mainboard.Summary.keyof().options,
  Classes
);
