export class Extract {
  static readonly NumberRegexp = /-?(\d+(\.\d+)?|\.\d+)/;

  static number(str: string): number | null {
    const result = str.match(this.NumberRegexp);
    if (result) return Number(result[0]);
    return null;
  }

  static date(str?: string): Date | undefined {
    if (str) {
      const date_str = str.match(
        /(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}/
      );
      if (date_str) {
        return new Date(date_str[0]);
      } else if (str.includes("Q")) {
        const [quarter_str, year_str] = str.matchAll(/\d+/g);
        const year = Number(year_str);

        return new Date((year > 90 ? 1900 : 2000) + year, Number(quarter_str));
      }
    }

    return undefined;
  }
}
