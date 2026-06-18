import * as Case from "@/utils/part/product/Case";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Case.Summary> = {
  form_factor: ({ value }) => value,
  mainboard_support: ({ value }) => value?.join(", "),
  radiator_support: ({ value }) => value?.join(", "),
  psu_support: ({ value }) => value?.join(", "),
};

const Classes: Partial<Record<keyof Case.Summary, string>> = {
  form_factor: "lg:w-36 lg:min-w-32",
  mainboard_support: "lg:w-56 lg:min-w-48",
  radiator_support: "lg:w-56 lg:min-w-48",
  psu_support: "lg:w-56 lg:min-w-48",
};

export default GenericSummaryCells(
  Components,
  Case.AttributeLabels,
  Case.Summary.keyof().options,
  Classes
);
