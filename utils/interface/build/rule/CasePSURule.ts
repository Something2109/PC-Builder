import { PCBuildRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  psu: [Products.PSU, Infos.PSU_SPEC],
  case_psu_support: [Products.CASE, Infos.CASE_PSU, "psu_support"],
  case_psu_length: [Products.CASE, Infos.CASE_SPEC, "max_psu_length"],
} as const;

const CasePSURule: PCBuildRule<typeof attributes> = {
  attributes,

  validate(build) {
    const { psu, case_psu_support, case_psu_length } = build;

    if (!psu || !case_psu_support || !case_psu_length) return false;

    if (!psu.form_factor || !case_psu_support?.includes(psu.form_factor))
      return false;

    if (!psu.length || case_psu_length < psu.length) return false;

    return true;
  },

  filter(build) {
    const { psu, case_psu_support, case_psu_length } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (psu?.length) {
      result.case_psu_length = [psu.length];
    }

    if (psu?.form_factor) {
      result.case_psu_support = [psu.form_factor];
    }

    if (case_psu_support && case_psu_support.length > 0) {
      result.psu = { ...result.psu, form_factor: case_psu_support };
    }

    if (case_psu_length) {
      result.psu = { ...result.psu, length: [case_psu_length] };
    }

    return result;
  },
};

export default CasePSURule;
