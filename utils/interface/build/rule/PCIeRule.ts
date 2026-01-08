import { AttributeRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  graphic_card_pcie: [Products.GRAPHIC_CARD, Infos.GRAPHIC_CARD_SPEC, "pcie"],
  mainboard_pcie: [Products.MAIN, Infos.MAIN_PCIE],
} as const;

const PCIeRule: AttributeRule<typeof attributes> = {
  name: "PCIe Compatibility Rule",

  attributes,

  validate(build) {
    const { graphic_card_pcie, mainboard_pcie } = build;

    if (!mainboard_pcie || !graphic_card_pcie)
      return "Not enough information to validate PCIe compatibility.";

    return;
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
        .filter((val) => val && val.width === "x16" && val?.count > 0)
        .map((val) => val!.version);

      result.graphic_card_pcie = [0, version[version.length - 1]];
    }

    return result;
  },
};

export default PCIeRule;
