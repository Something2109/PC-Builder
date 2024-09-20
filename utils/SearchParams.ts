import { PartType } from "./interface/Parts";

const FilterOptions: {
  [key in keyof PartType.FilterOptions]: (
    param: string | null
  ) => PartType.FilterOptions[key] | null;
} = {
  part: (param: string | null) => split(param),
  brand: (param: string | null) => split(param),
  series: (param: string | null) => split(param),
  launch_date: (param: string | null) =>
    split(param).map((value) => new Date(value)),
};

function split(param: string | null): string[] | null {
  if (param && param.length > 0) {
    return param.split(",");
  }
  return null;
}

function toSearchParams(options: PartType.FilterOptions): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    searchParams.set(key, value.join(","));
  });

  return searchParams;
}

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

export { SearchParams, toSearchParams };
