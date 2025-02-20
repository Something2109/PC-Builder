import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Radiator from "@/utils/interface/info/Radiator";

const Components: InfoSummaryMapping<Radiator.Info, Radiator.Summarizable> = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Radiator.Label,
  Radiator.SummaryAttributes
);
