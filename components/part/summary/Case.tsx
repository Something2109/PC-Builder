import { GenericSummaryCells } from "../TableWrapper";
import Case from "@/utils/interface/info/Case";
import { FunctionComponent } from "react";

const Components: {
  [key in Case.Summarizable]: FunctionComponent<{ value?: Case.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  mainboard_support: ({ value }) => value?.join(", "),
  radiator_support: ({ value }) =>
    [
      ...Object.values(value ?? {}).reduce((acc, val) => {
        val.forEach((type) => acc.add(type));
        return acc;
      }, new Set()),
    ].join(", "),
  psu_support: ({ value }) => value?.join(", "),
};

export default GenericSummaryCells(
  Components,
  Case.Label,
  Case.SummaryAttributes
);
