import { Products } from "@/utils/Enum";
import { BuildPartList, ProductRule } from "../../utils";

const ProductCompatibleRule: ProductRule = {
  name: "Product Requirement Rule",

  validate(build: BuildPartList) {
    const result: ReturnType<typeof this.validate> = {};

    if (!build.cpu) result[Products.CPU] = "CPU is required.";

    if (!build.mainboard) result[Products.MAIN] = "Mainboard is required.";

    if (!build.ram || build.ram.length === 0)
      result[Products.RAM] = "RAM is required.";

    if (
      (!build.ssd || build.ssd.length === 0) &&
      (!build.hdd || build.hdd.length === 0)
    ) {
      result[Products.SSD] =
        "At least one storage device (SSD or HDD) is required.";
      result[Products.HDD] =
        "At least one storage device (SSD or HDD) is required.";
    }

    if (!build.psu) result[Products.PSU] = "PSU is required.";

    if (!build.case) result[Products.CASE] = "Case is required.";

    const coolerCount =
      Number(Boolean(build.cooler)) +
      Number(Boolean(build.aio)) +
      Number(Boolean(build.cpu_block));

    if (coolerCount === 0 || coolerCount > 1) {
      const message =
        coolerCount === 0
          ? "At least one cooling solution (AIO, Cooler, or CPU Block) is required."
          : "Only one cooling solution (AIO, Cooler, or CPU Block) is allowed.";

      result[Products.AIO] = message;
      result[Products.COOLER] = message;
      result[Products.CPU_BLOCK] = message;
    }

    if (
      (build.radiator || build.pump || build.cpu_block) &&
      !(build.radiator && build.pump && build.cpu_block)
    ) {
      if (!build.radiator) result[Products.RADIATOR] = "Radiator is required.";

      if (!build.pump) result[Products.PUMP] = "Pump is required.";

      if (!build.cpu_block)
        result[Products.CPU_BLOCK] = "CPU Block is required.";
    }

    return result;
  },
};

export default ProductCompatibleRule;
