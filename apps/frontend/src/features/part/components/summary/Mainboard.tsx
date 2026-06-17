import * as Mainboard from "@/utils/part/product/Mainboard";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Mainboard.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  ram_form_factor: ({ value }) => value,
  ram_interface: ({ value }) => value,
};

const Classes: Partial<Record<keyof Mainboard.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  socket: "lg:w-32 lg:min-w-24",
  ram_form_factor: "lg:w-32 lg:min-w-24",
  ram_interface: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  Mainboard.AttributeLabels,
  Mainboard.Summary.keyof().options,
  Classes
);
