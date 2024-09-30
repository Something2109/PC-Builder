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

  export const SummaryAttributes = ["part", "brand", "series"] as const;

  export const FilterAttributes = ["part", "brand", "series"] as const;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: BasicInfo[key];
  };

  export type FilterOptions = FilterOptionsType<BasicInfo, Filterables>;
}

export default Part;
