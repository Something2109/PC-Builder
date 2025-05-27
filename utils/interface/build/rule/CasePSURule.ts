import { ProductRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  psu_form_factor: [Products.PSU, Infos.PSU_SPEC, "form_factor"],
  case_psu_support: [Products.CASE, Infos.CASE_PSU, "psu_support"],

  psu_length: [Products.PSU, Infos.PSU_SPEC, "length"],
  case_psu_length: [Products.CASE, Infos.CASE_SPEC, "max_psu_length"],
} as const;

const CasePSURule: ProductRule<typeof attributes> = {
  name: "Case PSU Compatibility Rule",

  attributes,

  validate(build) {
    const { psu_form_factor, psu_length, case_psu_support, case_psu_length } =
      build;

    if (
      !psu_form_factor ||
      !psu_length ||
      !case_psu_support ||
      !case_psu_length
    )
      return "Not enough information to validate PSU compatibility.";

    if (!case_psu_support?.includes(psu_form_factor)) {
      return `The case does not support the PSU ${psu_form_factor} form factor.`;
    }

    if (case_psu_length < psu_length) {
      return `The PSU length exceeds the case's PSU length support (${case_psu_length}mm < ${psu_length}mm).`;
    }

    return;
  },

  filter(build) {
    const { psu_form_factor, psu_length, case_psu_support, case_psu_length } =
      build;
    const result: ReturnType<typeof this.filter> = {};

    if (psu_length) {
      result.case_psu_length = [psu_length];
    }

    if (psu_form_factor) {
      result.case_psu_support = [psu_form_factor];
    }

    if (case_psu_support && case_psu_support.length > 0) {
      result.psu_form_factor = case_psu_support.filter(
        (formFactor) => formFactor !== undefined
      );
    }

    if (case_psu_length) {
      result.psu_length = [case_psu_length];
    }

    return result;
  },
};

export default CasePSURule;
