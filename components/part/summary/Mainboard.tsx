import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Mainboard from "@/utils/interface/product/Mainboard";

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
