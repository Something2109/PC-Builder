import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import { SuffixDisplay } from "@/components/utils/Display";
import * as PSU from "@/utils/part/product/PSU";

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
