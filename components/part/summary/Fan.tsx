import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Fan from "@/utils/interface/info/Fan";

const Components: InfoSummaryMapping<Fan.Info, Fan.Summarizable> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => value,
  bearing: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Fan.Label,
  Fan.SummaryAttributes
);
