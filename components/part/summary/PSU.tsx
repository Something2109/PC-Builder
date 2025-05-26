import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import PSU from "@/utils/interface/part/product/PSU";

const Components: InfoSummaryMapping<PSU.Summary> = {
  wattage: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  efficiency: ({ value }) => value,
  form_factor: ({ value }) => value,
  modular: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  PSU.AttributeLabels,
  PSU.Summary.keyof().options
);
