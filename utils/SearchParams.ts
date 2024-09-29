import Part from "./interface/part/Parts";

const FilterOptions: {
  [key in keyof Part.FilterOptions]: (
    param: string | null
  ) => Part.FilterOptions[key] | null;
} = {
  part: (param: string | null) => split(param),
  brand: (param: string | null) => split(param),
  series: (param: string | null) => split(param),
};

function split(param: string | null): string[] | null {
  if (param && param.length > 0) {
    return param.split(",");
  }
  return null;
}

function toSearchParams(options: Part.FilterOptions): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    searchParams.set(key, value.join(","));
  });

  return searchParams;
}

const SearchParams = {
  toFilterOptions: (searchParams: URLSearchParams) => {
    const options: Part.FilterOptions = {};

    [...searchParams.entries()].forEach(([key, value]) => {
      const toOption = FilterOptions[key as keyof Part.FilterOptions];
      if (toOption) {
        const param = toOption(value);
        if (param) {
          options[key as keyof Part.FilterOptions] = param as any;
        }
      }
    });

    return options;
  },

  toPageOptions: (searchParams: URLSearchParams) => {
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(
      searchParams.get("limit") ?? Number(process.env.PageSize)
    );

    return { page, limit };
  },
};

export { SearchParams, toSearchParams };
