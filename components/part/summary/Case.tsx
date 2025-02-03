import { GenericSummaryCells } from "../TableWrapper";
import Case from "@/utils/interface/part/Case";
import { FunctionComponent } from "react";

const Components: {
  [key in Case.Summarizable]: FunctionComponent<{ value?: Case.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  mainboard_support: ({ value }) => value?.join(", "),
  radiator_support: ({ value }) =>
    Object.values(value ?? {})
      .reduce((acc, val) => {
        acc.push(...val);
        return acc;
      }, [])
      .join(", "),
  psu_support: ({ value }) => value?.join(", "),
};

export default GenericSummaryCells(
  Components,
  Case.Label,
  Case.SummaryAttributes
);
