import * as Radiator from "@/utils/part/product/Radiator";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Radiator.Summary> = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

const Classes: Partial<Record<keyof Radiator.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  material: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  Radiator.AttributeLabels,
  Radiator.Summary.keyof().options,
  Classes
);
