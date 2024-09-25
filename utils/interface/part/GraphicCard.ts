import GPU from "./GPU";

namespace GraphicCard {
  export type Info = {
    width: number;
    length: number;
    height: number;

    base_frequency: number;
    boost_frequency: number;

    pcie: number;
    minimum_psu: number;
    power_connector: string;

    gpu: GPU.Info;
  };

  export const BasicAttrList: (keyof Info)[] = [
    "width",
    "length",
    "height",
    "base_frequency",
    "boost_frequency",
    "minimum_psu",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default GraphicCard;
