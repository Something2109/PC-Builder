import Part from "@/utils/part";

export class FilterOptionBuilder {
  private result: {
    [key in keyof Part.Filter]?: Record<string, string[] | number[]> | null;
  } = {};

  add(info: keyof Part.Filter, key: string, value?: string[] | number[]) {
    if (value && value.length > 0) {
      this.result ??= {};
      this.result[info] ??= {};
      this.result[info][key] = value;
    }
    return this;
  }

  build() {
    return this.result as Part.Filter;
  }
}
