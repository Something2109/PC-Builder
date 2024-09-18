import { PartType } from "./interface/Parts";

const FilterOptions: {
  [key in keyof PartType.FilterOptions]: (
    param: string | null
  ) => PartType.FilterOptions[key] | null;
} = {
  part: (param: string | null) => param?.split(","),
  brand: (param: string | null) => param?.split(","),
  series: (param: string | null) => param?.split(","),
  launch_date: (param: string | null) =>
    param?.split(",").map((value) => new Date(value)),
};

const SearchParams = {
  toFilterOptions: (searchParams: URLSearchParams) => {
    const options: PartType.FilterOptions = {};

    [...searchParams.entries()].forEach(([key, value]) => {
      const toOption = FilterOptions[key as keyof PartType.FilterOptions];
      if (toOption) {
        const param = toOption(value);
        if (param) {
          options[key as keyof PartType.FilterOptions] = param as any;
        }
      }
    });

    return options;
  },

  toPageOptions: (searchParams: URLSearchParams) => {
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "50");

    return { page, limit };
  },
};

export { SearchParams };
