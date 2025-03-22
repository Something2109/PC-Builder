import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Radiator from "@/utils/interface/product/Radiator";

const Components: InfoSummaryMapping<Radiator.Summary> = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Radiator.AttributeLabels,
  Radiator.Summary.keyof().options
);
