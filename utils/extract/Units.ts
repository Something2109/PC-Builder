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

    const NumberRegex = "-?\\d+\\.?\\d*|-?\\d*\\.?\\d+";
    const UnitRegex = Object.keys(ratio).join("|");
    this.Regexp = new RegExp(
      `(^|\\W)(${NumberRegex})?[ _-]*(${UnitRegex})(\\W|$)`
    );
  }

  list() {
    return this.Order;
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

  /**
   * Create the required attributes of the unit class
   * based on the given list of ordered units
   * and the step value of adjacent unit.
   * @param units The ordered unit list.
   * @param step The step between each pair of adjacent unit.
   * @returns The required attributes.
   */
  private attributeFromArray(units: Units[], step: number) {
    const exchanger = units.reduce((acc, curr, index) => {
      acc[curr] = Math.pow(step, index);
      return acc;
    }, {} as Record<Units, number>);

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
        return newRatio > prev ? newRatio : prev;
      }, 1);

    return [exchanger, order, step] as const;
  }
}

type DerivedUnitName<
  Unit1 extends string,
  Unit2 extends string
> = `${Unit1}/${Unit2}`;

/**
 * The generic derived unit class.
 * Use in parsing and exchanging unit value in the project.
 * Created by passing two units to the constructor.
 */
class DerivedUnit<Unit1 extends string, Unit2 extends string>
  implements UnitInterface<DerivedUnitName<Unit1, Unit2>>
{
  private readonly unit1: UnitInterface<Unit1>;
  private readonly unit2: UnitInterface<Unit2>;
  private readonly Regexp: RegExp;

  constructor(unit1: UnitInterface<Unit1>, unit2: UnitInterface<Unit2>) {
    this.unit1 = unit1;
    this.unit2 = unit2;

    const NumberRegex = "-?\\d+\\.?\\d*|-?\\d*\\.?\\d+";
    const Unit1Regex = unit1.list().join("|");
    const Unit2Regex = unit2.list().join("|");
    this.Regexp = new RegExp(
      `(^|\\W)(${NumberRegex})?[ _-]*(${Unit1Regex})\/(${Unit2Regex})(\\W|$)`
    );
  }

  list(): DerivedUnitName<Unit1, Unit2>[] {
    return this.unit1
      .list()
      .map((val1) => this.unit2.list().map((val2) => this.toUnit(val1, val2)))
      .flat();
  }

  parse(str: string): [number | null, DerivedUnitName<Unit1, Unit2>] | null {
    const result = str.match(this.Regexp);

    if (!result) return null;

    const [num, unit1, unit2] = this.extractRegexResult(result);

    return [num, this.toUnit(unit1, unit2)];
  }

  parseAll(str: string): [number | null, DerivedUnitName<Unit1, Unit2>][] {
    const results = str.matchAll(this.Regexp);

    return [...results].map((result) => {
      const [num, unit1, unit2] = this.extractRegexResult(result);

      return [num, this.toUnit(unit1, unit2)];
    });
  }

  ratio(
    src: DerivedUnitName<Unit1, Unit2>,
    dest: DerivedUnitName<Unit1, Unit2>
  ): number {
    const result1 = src.match(this.Regexp);
    const result2 = dest.match(this.Regexp);

    if (!result1) throw new Error(`Cannot extract unit from type ${src}`);
    if (!result2) throw new Error(`Cannot extract unit from type ${dest}`);

    const [_, src1, src2] = this.extractRegexResult(result1);
    const [__, dest1, dest2] = this.extractRegexResult(result2);

    return this.unit1.ratio(src1, dest1) / this.unit2.ratio(src2, dest2);
  }

  exchange(
    num: number,
    src: DerivedUnitName<Unit1, Unit2>,
    dest: DerivedUnitName<Unit1, Unit2>
  ): number {
    return num * this.ratio(src, dest);
  }

  /**
   * Create the name of the composite unit by combining the name of the 2 units.
   * @param unit1 The first unit.
   * @param unit2 The second unit.
   * @returns The composite unit.
   */
  private toUnit(unit1: Unit1, unit2: Unit2): DerivedUnitName<Unit1, Unit2> {
    return `${unit1}/${unit2}` as DerivedUnitName<Unit1, Unit2>;
  }

  /**
   * The utility function used to transform the regex result
   * to the parse result type.
   * @param result The regex match result.
   * @returns The result tuple of {@link parse} and {@link parseAll}.
   */
  private extractRegexResult(
    result: RegExpMatchArray | RegExpExecArray
  ): [number | null, Unit1, Unit2] {
    const [_, __, num, unit1, unit2] = result;

    return [num ? Number(num) : null, unit1 as Unit1, unit2 as Unit2];
  }
}

const MemoryUnits = new Unit(["B", "KB", "MB", "GB", "TB", "PB"], 1024);

const FrequencyUnits = new Unit(
  ["Hz", "KHz", "MHz", "GHz", "THz", "PHz"],
  1000
);

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

const MemorySpeedUnit = new DerivedUnit(MemoryUnits, TimeUnits);

const LengthSpeedUnit = new DerivedUnit(LengthUnits, TimeUnits);

const VolumeSpeedUnit = new DerivedUnit(VolumeUnits, TimeUnits);

const TransferSpeedUnit = new DerivedUnit(TransferUnits, TimeUnits);

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
