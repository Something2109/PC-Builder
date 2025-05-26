import { BuildPartList, GenericRule } from "../../utils";

const ProductCompatibleRule: GenericRule = {
  name: "Product Requirement Rule",

  validate(build: BuildPartList): string[] {
    const result: string[] = [];

    if (!build.cpu) result.push("CPU is required.");

    if (!build.mainboard) result.push("Mainboard is required.");

    if (!build.ram || build.ram.length === 0) result.push("RAM is required.");

    if (
      (!build.ssd || build.ssd.length === 0) &&
      (!build.hdd || build.hdd.length === 0)
    )
      result.push("At least one storage device (SSD or HDD) is required.");

    if (!build.psu) result.push("PSU is required.");

    if (!build.case) result.push("Case is required.");

    const coolerCount =
      Number(Boolean(build.cooler)) +
      Number(Boolean(build.aio)) +
      Number(Boolean(build.cpu_block));

    if (coolerCount === 0) {
      result.push(
        "At least one cooling solution (AIO, Cooler, or CPU Block) is required."
      );
    }

    if (coolerCount > 1) {
      result.push(
        "Only one cooling solution (AIO, Cooler, or CPU Block) is allowed."
      );
    }

    if (
      (build.radiator || build.pump || build.cpu_block) &&
      !(build.radiator && build.pump && build.cpu_block)
    ) {
      result.push(
        "If using a custom loop, all components (Radiator, Pump, and CPU Block) are required."
      );
    }

    return result;
  },
};

export default ProductCompatibleRule;
