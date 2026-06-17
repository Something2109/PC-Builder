import * as Case from "@/utils/part/product/Case";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Case.Summary> = {
  form_factor: ({ value }) => value,
  mainboard_support: ({ value }) => value?.join(", "),
  radiator_support: ({ value }) => value?.join(", "),
  psu_support: ({ value }) => value?.join(", "),
};

const Classes: Partial<Record<keyof Case.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  mainboard_support: "lg:w-48 lg:min-w-40",
  radiator_support: "lg:w-48 lg:min-w-40",
  psu_support: "lg:w-48 lg:min-w-40",
};

export default GenericSummaryCells(
  Components,
  Case.AttributeLabels,
  Case.Summary.keyof().options,
  Classes
);
