import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import * as Radiator from "@/utils/part/product/Radiator";

const Components: InfoSummaryMapping<Radiator.Summary> = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Radiator.AttributeLabels,
  Radiator.Summary.keyof().options
);
