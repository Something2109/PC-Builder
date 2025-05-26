import { ProductRule } from "../utils";
import { Infos, Products } from "@/utils/Enum";

const attributes = {
  cpu_gpu: [Products.CPU, Infos.GPU_SPEC, "family"],
  graphic_card_gpu: [Products.GRAPHIC_CARD, Infos.GPU_SPEC, "family"],
} as const;

const GPURule: ProductRule<typeof attributes> = {
  name: "Case PSU Compatibility Rule",

  attributes,

  validate(build) {
    const { cpu_gpu, graphic_card_gpu } = build;

    if (!cpu_gpu && !graphic_card_gpu) {
      return "No GPU found in the build.";
    }

    return;
  },

  filter(build) {
    const result: ReturnType<typeof this.filter> = {};

    return result;
  },
};

export default GPURule;
