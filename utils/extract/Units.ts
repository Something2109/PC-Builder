interface UnitInterface<Units extends string> {
  /**
   * Get the full list of unit names.
   */
  list(): Units[];

  /**
   * Extract the first number value and unit name from the string parameter.
   * If no number found, return null and the discovered unit name.
   * If no unit name found, return null.
   * @param str The string to extract.
   * @returns A tuple of number and the unit name or null.
   */
  parse(str: string): [number | null, Units] | null;

  /**
   * Extract all occurence of number value and unit name from the string parameter.
   * Return an array of value and unit name tuples.
   * @param str The string to extract.
   * @returns An array of number value and unit tuples.
   */
  parseAll(str: string): [number | null, Units][];

  /**
   * Return the number representing the amount of {@link dest} unit
   * that equal to 1 {@link src} unit.
   * @param src The first unit name.
   * @param dest The second unit name.
   * @returns The number representing the ratio.
   */
  ratio(src: Units, dest: Units): number;

  /**
   * Exchange the {@link num} number corresponding to the {@link src} unit name
   * to the value corresponding to the {@link dest} unit.
   * @param num The number to exchange.
   * @param src The first unit name.
   * @param dest The second unit name.
   * @returns The numnber value corresponding to the {@link dest} unit.
   */
  exchange(num: number, src: Units, dest: Units): number;
}

/**
 * The generic unit class.
 * Use in parsing and exchanging unit value in the project.
 * Created by passing an object of unit name key and ratio value
 * or an array of unit in ascending value order and the step between each unit.
 */
class Unit<Units extends string> implements UnitInterface<Units> {
  private readonly Exchanger: Record<Units, number>;
  private readonly Regexp: RegExp;

  constructor(ratio: Units[] | Record<Units, number>, step = 1) {
    ratio = Array.isArray(ratio)
      ? ratio.reduce((acc, curr, index) => {
          acc[curr] = Math.pow(step, index);
          return acc;
        }, {} as Record<Units, number>)
      : ratio;
    this.Exchanger = ratio;

    const NumberRegex = "-?\\d+\\.?\\d*|-?\\d*\\.?\\d+";
    const UnitRegex = Object.keys(ratio).join("|");
    this.Regexp = new RegExp(
      `(^|\\W)(${NumberRegex})?[ _-]*(${UnitRegex})(\\W|$)`
    );
  }

  list() {
    return Object.keys(this.Exchanger) as Units[];
  }

  parse(str: string): [number | null, Units] | null {
    const result = str.match(this.Regexp);

    if (!result) return null;

    return this.extractRegexResult(result);
  }

  parseAll(str: string): [number | null, Units][] {
    const results = str.matchAll(this.Regexp);

    return [...results].map((result) => this.extractRegexResult(result));
  }

  ratio(src: Units, dest: Units): number {
    return this.Exchanger[src] / this.Exchanger[dest];
  }

  exchange(num: number, src: Units, dest: Units) {
    return num * this.ratio(src, dest);
  }

  /**
   * The utility function used to transform the regex result
   * to the parse result type.
   * @param result The regex match result.
   * @returns The result tuple of {@link parse} and {@link parseAll}.
   */
  private extractRegexResult(
    result: RegExpMatchArray | RegExpExecArray
  ): [number | null, Units] {
    const [_, __, num, unit] = result;

    return [num ? Number(num) : null, unit as Units];
  }
}

const MemoryUnits = new Unit(["B", "KB", "MB", "GB", "TB", "PB"], 1024);

const FrequencyUnits = new Unit(
  ["Hz", "KHz", "MHz", "GHz", "THz", "PHz"],
  1000
);

const LengthUnits = new Unit(["mm", "cm", "dm", "m", "km"], 1000);

const VolumeUnits = new Unit(["ml", "L"], 1000);

const TimeUnits = new Unit({
  ns: 1,
  μs: 1000,
  ms: 1000 * 1000,
  s: 1000 * 1000 * 1000,
  min: 60 * 1000 * 1000 * 1000,
  h: 60 * 60 * 1000 * 1000 * 1000,
});

const TransferUnits = new Unit(["T", "KT", "MT", "GT"], 1000);

export {
  type UnitInterface,
  MemoryUnits,
  FrequencyUnits,
  LengthUnits,
  TimeUnits,
  TransferUnits,
};
