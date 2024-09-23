import { Extract } from "./String";

class UnitExtract<Units extends string> {
  private ratio: Record<Units, number>;
  private readonly UnitRegexp: RegExp;
  private readonly NumberRegexp: RegExp;

  constructor(ratio: Record<Units, number>) {
    this.ratio = ratio;
    this.UnitRegexp = new RegExp(Object.keys(ratio).join("|"));
    this.NumberRegexp = new RegExp(
      `${Extract.NumberRegexp.source} *(${this.UnitRegexp.source})`,
      "g"
    );
  }

  unit(str: string): Units | null {
    const result = str.match(this.UnitRegexp);
    if (result) return result[0] as Units;
    return null;
  }

  find(str: string): [number, Units] | null {
    const unitStr = str.match(this.NumberRegexp);
    if (!unitStr) {
      return null;
    }

    let number = Extract.number(str);
    let src = this.unit(unitStr[0]);
    if (number && src) {
      return [number, src];
    }

    return null;
  }

  exchange(num: number, src: Units, dest: Units) {
    return (num * this.ratio[src]) / this.ratio[dest];
  }

  read(str: string, dest: Units, src?: Units): number | null {
    let number: number | null;

    if (!src) {
      const extract = this.find(str);
      if (!extract) {
        return null;
      }

      number = extract[0];
      src = extract[1];
    } else {
      number = Extract.number(str);
    }

    if (src && number) {
      return this.exchange(number, src, dest);
    }

    return null;
  }
}

const MemoryUnits = new UnitExtract({
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  PB: 1024 * 1024 * 1024 * 1024 * 1024,
});

const FrequencyUnits = new UnitExtract({
  Hz: 1,
  KHz: 1000,
  MHz: 1000 * 1000,
  GHz: 1000 * 1000 * 1000,
  THz: 1000 * 1000 * 1000 * 1000,
  PHz: 1000 * 1000 * 1000 * 1000 * 1000,
});

const LengthUnits = new UnitExtract({
  mm: 1 / 1000,
  cm: 1 / 100,
  dm: 1 / 10,
  m: 1,
  km: 1000,
});

export { MemoryUnits, FrequencyUnits, LengthUnits };
