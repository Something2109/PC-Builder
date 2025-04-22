import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import Fan from "@/utils/interface/part/product/Fan";

const Components: InfoSummaryMapping<Fan.Summary> = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  bearing: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Fan.AttributeLabels,
  Fan.Summary.keyof().options
);
