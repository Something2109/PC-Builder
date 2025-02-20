import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Case from "@/utils/interface/info/Case";

const Components: InfoSummaryMapping<Case.Info, Case.Summarizable> = {
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
