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

  /**
   * Exchange the {@link num} based on its value corresponding
   * to a ${@link threshold} number.
   * If the {@link num} value is greater than the {@link threshold},
   * lower down the unit value of it.
   *
   * @param num The number to exchange.
   * @param src The unit name of the {@link num}.
   * @param threshold The max value the result should be.
   * @returns The tuple of result value and its unit.
   */
  adaptiveExchange(num: number, src: Units, threshold: number): [number, Units];
}

/**
 * The generic unit class.
 * Use in parsing and exchanging unit value in the project.
 * Created by passing an object of unit name key and ratio value
 * or an array of unit in ascending value order and the step between each unit.
 */
class Unit<Units extends string> implements UnitInterface<Units> {
  private readonly Exchanger: Record<Units, number>;
  private readonly Order: Units[];
  private readonly Step: number;
  private readonly Regexp: RegExp;

  constructor(ratio: Units[] | Record<Units, number>, step = 1) {
    const [Exchanger, Order, Step] = Array.isArray(ratio)
      ? this.attributeFromArray(ratio, step)
      : this.attributeFromObject(ratio);

    this.Exchanger = Exchanger;
    this.Order = Order;
    this.Step = Step;

    const NumberRegex = String.raw`-?\d+\.?\d*|-?\d*\.?\d+`;
    const UnitRegex = Order.join("|");
    this.Regexp = new RegExp(String.raw`(^|\W)(${NumberRegex})?[ _-]*(${UnitRegex})(\W|$)`);
  }

  list() {
    return this.Order;
  }

  parse(str: string): [number | null, Units] | null {
    const result = this.Regexp.exec(str);

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

  adaptiveExchange(
    num: number,
    src: Units,
    threshold: number = this.Step,
    min: number = 0
  ): [number, Units] {
    if (num <= threshold && num >= 0) return [num, src];

    let current = this.Order.indexOf(src);

    while (num > threshold || num < min) {
      const nextIndex = num > threshold ? current + 1 : current - 1;

      if (nextIndex === -1 || nextIndex === this.Order.length) break;

      num = this.exchange(num, src, this.Order[nextIndex]);
      src = this.Order[nextIndex];
      current = nextIndex;
    }

    return [num, src];
  }

  /**
   * The utility function used to transform the regex result
   * to the parse result type.
   * @param result The regex match result.
   * @returns The result tuple of {@link parse} and {@link parseAll}.
   */
  private extractRegexResult(result: RegExpMatchArray | RegExpExecArray): [number | null, Units] {
    const [, , num, unit] = result;

    return [num ? Number(num) : null, unit as Units];
  }

  /**
   * Create the required attributes of the unit class
   * based on the given list of ordered units
   * and the step value of adjacent unit.
   * @param units The ordered unit list.
   * @param step The step between each pair of adjacent unit.
   * @returns The required attributes.
   */
  private attributeFromArray(units: Units[], step: number) {
    const exchanger = units.reduce(
      (acc, curr, index) => {
        acc[curr] = Math.pow(step, index);
        return acc;
      },
      {} as Record<Units, number>
    );

    return [exchanger, units, step] as const;
  }

  /**
   * Create the required attributes of the unit class
   * based on the given record of unit key and its relative values.
   * @param ratio The record of unit name and value.
   * @returns The required attributes.
   */
  private attributeFromObject(ratio: Record<Units, number>) {
    const exchanger = ratio;

    const order = Object.keys(exchanger).sort(
      (a, b) => exchanger[a as Units] - exchanger[b as Units]
    ) as Units[];

    const step = Object.values<number>(ratio)
      .sort((a, b) => a - b)
      .reduce((prev, curr, index, arr) => {
        const newRatio = index > 0 ? curr / arr[index - 1] : 1;
        return Math.max(newRatio, prev);
      }, 1);

    return [exchanger, order, step] as const;
  }
}

type DerivedUnitName<Unit1 extends string, Unit2 extends string> = `${Unit1}/${Unit2}`;

/**
 * Create the ratio object of the derived unit from the 2 unit objects.
 * Cautious: order does matter.
 *
 * @param unit1 The first unit.
 * @param unit2 The second unit.
 * @returns The record of derived unit names and number ratio.
 */
function ratioFromUnits<Unit1 extends string, Unit2 extends string>(
  unit1: UnitInterface<Unit1>,
  unit2: UnitInterface<Unit2>
): Record<DerivedUnitName<Unit1, Unit2>, number> {
  const Unit1Order = unit1.list();
  const Unit2Order = unit2.list();

  const BaseUnit1 = Unit1Order[0];
  const BaseUnit2 = Unit2Order[Unit2Order.length - 1];

  const ratio = Unit1Order.reduce(
    (acc, curr1) => {
      for (const curr2 of Unit2Order) {
        const unit = `${curr1}/${curr2}` as const;
        acc[unit] = unit1.ratio(curr1, BaseUnit1) / unit2.ratio(curr2, BaseUnit2);
      }

      return acc;
    },
    {} as Record<DerivedUnitName<Unit1, Unit2>, number>
  );

  return ratio;
}

const MemoryUnits = new Unit(["B", "KB", "MB", "GB", "TB", "PB"], 1024);

const FrequencyUnits = new Unit(["Hz", "KHz", "MHz", "GHz", "THz", "PHz"], 1000);

const LengthUnits = new Unit(["mm", "cm", "dm", "m", "km"], 10);

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

const MemorySpeedUnit = new Unit(ratioFromUnits(MemoryUnits, TimeUnits));

const LengthSpeedUnit = new Unit(ratioFromUnits(LengthUnits, TimeUnits));

const VolumeSpeedUnit = new Unit(ratioFromUnits(VolumeUnits, TimeUnits));

const TransferSpeedUnit = new Unit(ratioFromUnits(TransferUnits, TimeUnits));

export {
  type UnitInterface,
  MemoryUnits,
  FrequencyUnits,
  LengthUnits,
  TimeUnits,
  TransferUnits,
  MemorySpeedUnit,
  LengthSpeedUnit,
  VolumeSpeedUnit,
  TransferSpeedUnit,
};
