import { Products } from "./Enum";

class SearchString {
  private static ProductRegexp = (() => {
    const result: any = {};

    Object.values(Products).forEach((value) => {
      result[value] = new RegExp(
        `(^|\W*)${value.replaceAll("_", "\\W*")}(\W*|$)`,
        "ig"
      );
    });

    return result as Record<Products, RegExp>;
  })();

  static toProducts(str: string) {
    const part: Products[] = [];

    Object.entries(this.ProductRegexp).forEach(([key, regexp]) => {
      if (str.match(regexp)) {
        part.push(key as Products);

        str = str.replaceAll(regexp, "").trim();
      }
    });

    return { str, part };
  }
}

export { SearchString };
