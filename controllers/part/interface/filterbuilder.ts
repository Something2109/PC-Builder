import { FilterOptions } from "@/utils/interface";

export class FilterOptionBuilder {
  private result: {
    [key in keyof FilterOptions]?: Record<string, string[] | number[]> | null;
  } = {};

  add(info: keyof FilterOptions, key: string, value?: string[] | number[]) {
    if (value && value.length > 0) {
      if (!this.result) this.result = {};

      if (!this.result[info]) this.result[info] = {} as never;

      this.result[info][key] = value;
    }
    return this;
  }

  build() {
    return FilterOptions.parse(this.result);
  }
}
