import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import * as Case from "@/utils/part/product/Case";

const Components: InfoSummaryMapping<Case.Summary> = {
  form_factor: ({ value }) => value,
  mainboard_support: ({ value }) => value?.join(", "),
  radiator_support: ({ value }) => value?.join(", "),
  psu_support: ({ value }) => value?.join(", "),
};

export default GenericSummaryCells(
  Components,
  Case.AttributeLabels,
  Case.Summary.keyof().options
);
