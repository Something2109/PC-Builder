export default class Validate {
  static string(value?: string | null) {
    if (!value || typeof value !== "string" || value.length === 0) {
      throw new Error(`This value is not string type: ${value}`);
    }
    return value;
  }

  static number(value?: string | number | null) {
    const num_val = Number(value);
    if (typeof num_val !== "number") {
      throw new Error(`This value is not number type: ${value}`);
    }
    return num_val;
  }

  static boolean(value?: boolean | null) {
    if (typeof value !== "boolean") {
      throw new Error(`This value is not boolean type: ${value}`);
    }
    return value;
  }
}
