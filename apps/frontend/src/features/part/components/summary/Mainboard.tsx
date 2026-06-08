import * as Mainboard from "@/utils/part/product/Mainboard";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Mainboard.Summary> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  ram_form_factor: ({ value }) => value,
  ram_interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Mainboard.AttributeLabels,
  Mainboard.Summary.keyof().options
);
