import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import RAM from "@/utils/interface/part/product/RAM";

const Components: InfoSummaryMapping<RAM.Summary> = {
  speed: ({ value }) => <SuffixDisplay suffix="MT/s">{value}</SuffixDisplay>,
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  RAM.AttributeLabels,
  RAM.Summary.keyof().options
);
