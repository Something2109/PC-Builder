import { PCBuildRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  graphic_card_pcie: [Products.GRAPHIC_CARD, Infos.GRAPHIC_CARD_SPEC, "pcie"],
  mainboard_pcie: [Products.MAIN, Infos.MAIN_PCIE],
} as const;

const PCIeRule: PCBuildRule<typeof attributes> = {
  attributes,

  validate(build) {
    const { graphic_card_pcie, mainboard_pcie } = build;

    if (!mainboard_pcie || !graphic_card_pcie) return false;

    for (const pcie of mainboard_pcie) {
      if (pcie.width !== "x16") continue;

      if (pcie.count === 0) continue;
    }

    return false;
  },

  filter(build) {
    const { graphic_card_pcie, mainboard_pcie } = build;
    const result: ReturnType<typeof this.filter> = {};

    if (graphic_card_pcie && graphic_card_pcie.length > 0) {
      result.mainboard_pcie = {
        width: ["x16"],
      };
    }

    if (mainboard_pcie && mainboard_pcie.length > 0) {
      const version = mainboard_pcie
        .filter((val) => val.width === "x16" && val?.count > 0)
        .map((val) => val.version);

      result.graphic_card_pcie = [version[version.length - 1]];
    }

    return result;
  },
};

export default PCIeRule;
