import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import Fan from "@/utils/interface/info/Fan";

const Components: InfoSummaryMapping<Fan.Info, Fan.Summarizable> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  bearing: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Fan.Label,
  Fan.SummaryAttributes
);
