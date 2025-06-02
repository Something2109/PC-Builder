import { AttributeRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  mainboard_form_factor: [Products.MAIN, Infos.MAIN_SPEC, "form_factor"],
  case_main_support: [Products.CASE, Infos.CASE_MAIN, "form_factor"],
} as const;

const CaseMainboardRule: AttributeRule<typeof attributes> = {
  name: "Case Mainboard Compatibility Rule",

  attributes,

  validate(build) {
    const result: ReturnType<typeof this.validate> = {};
    const { mainboard_form_factor, case_main_support } = build;

    if (!mainboard_form_factor) {
      result.mainboard_form_factor = "Mainboard form factor is not specified.";
    }

    if (case_main_support.length === 0) {
      result.case_main_support = "Case Mainboard form factor is not specified.";
    }

    if (!mainboard_form_factor || case_main_support.length === 0) return result;

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
