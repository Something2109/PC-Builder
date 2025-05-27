import { ProductRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  mainboard_form_factor: [Products.MAIN, Infos.MAIN_SPEC, "form_factor"],
  case_main_support: [Products.CASE, Infos.CASE_MAIN, "form_factor"],
} as const;

const CaseMainboardRule: ProductRule<typeof attributes> = {
  name: "Case Mainboard Compatibility Rule",

  attributes,

  validate(build) {
    const { mainboard_form_factor, case_main_support } = build;

    if (!mainboard_form_factor || !case_main_support) {
      return "Not enough information to validate mainboard form factor compatibility.";
    }

    if (!case_main_support.includes(mainboard_form_factor)) {
      return `The case does not support the mainboard ${mainboard_form_factor} form factor.`;
    }

    return;
  },

  filter(build) {
    const { case_main_support, mainboard_form_factor } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (mainboard_form_factor) {
      result.case_main_support = [mainboard_form_factor];
    }

    if (case_main_support && case_main_support.length > 0) {
      result.mainboard_form_factor = case_main_support.filter(
        (formFactor) => formFactor !== undefined
      );
    }

    return result;
  },
};

export default CaseMainboardRule;
