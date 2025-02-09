import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import HDD from "@/utils/interface/info/HDD";

const Components: InfoSummaryMapping<HDD.Info, HDD.Summarizable> = {
  capacity: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  HDD.Label,
  HDD.SummaryAttributes
);
