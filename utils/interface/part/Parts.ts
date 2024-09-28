import { FilterOptionsType } from "../utils";

namespace Part {
  export type BasicInfo = {
    id: string;

    part: string;
    name: string;
    code_name: string;
    brand: string;
    series: string;

    launch_date?: Date;
    url?: string;
    image_url?: string;
  };

  export const FilterAttributes = ["part", "brand", "series"] as const;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<BasicInfo, Filterables>;
}

export default Part;
