import * as Radiator from "@/utils/part/product/Radiator";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Radiator.Summary> = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Radiator.AttributeLabels,
  Radiator.Summary.keyof().options
);
