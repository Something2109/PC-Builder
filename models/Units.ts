type MemoryUnitName = "B" | "KB" | "MB" | "GB" | "TB" | "PB";

class MemoryUnits {
  static readonly ratio: Record<MemoryUnitName, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
    PB: 1024 * 1024 * 1024 * 1024 * 1024,
  };

  private static unit(str: string): MemoryUnitName | undefined {
    const unit = str.match(/[KMGTP]?B/);

    if (unit) {
      return unit[0] as MemoryUnitName;
    }
  }

  private static read(str?: string): number | undefined {
    if (str) {
      const mb_str = str.match(/\d+(.\d+)?/);
      const unit = this.unit(str);

      if (mb_str && unit) {
        let num = Number(mb_str[0]) * this.ratio[unit];

        return num;
      }
    }

    return undefined;
  }

  static KB(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["KB"];
    }

    return undefined;
  }

  static MB(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["MB"];
    }

    return undefined;
  }

  static GB(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["GB"];
    }

    return undefined;
  }
}

type FrequencyUnitName = "Hz" | "KHz" | "MHz" | "GHz" | "THz" | "PHz";

class FrequencyUnits {
  static readonly ratio: Record<FrequencyUnitName, number> = {
    Hz: 1,
    KHz: 1000,
    MHz: 1000 * 1000,
    GHz: 1000 * 1000 * 1000,
    THz: 1000 * 1000 * 1000 * 1000,
    PHz: 1000 * 1000 * 1000 * 1000 * 1000,
  };

  private static unit(str: string): FrequencyUnitName | undefined {
    const unit = str.match(/[KMGTP]?Hz/);

    if (unit) {
      return unit[0] as FrequencyUnitName;
    }
  }

  private static read(str?: string): number | undefined {
    if (str) {
      const mb_str = str.match(/\d+(.\d+)?/);
      const unit = this.unit(str);

      if (mb_str && unit) {
        let num = Number(mb_str[0]) * this.ratio[unit];

        return num;
      }
    }

    return undefined;
  }

  static KHz(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["KHz"];
    }

    return undefined;
  }

  static MHz(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["MHz"];
    }

    return undefined;
  }

  static GHz(str?: string): number | undefined {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["GHz"];
    }

    return undefined;
  }
}

type LengthUnitName = "mm" | "cm" | "dm" | "m" | "km";

class LengthUnits {
  static readonly ratio: Record<LengthUnitName, number> = {
    mm: 1 / 1000,
    cm: 1 / 100,
    dm: 1 / 10,
    m: 1,
    km: 1000,
  };

  private static read(str?: string): number | undefined {
    if (str) {
      const mb_str = str.match(/\d+(.\d+)?/);
      const unit = this.unit(str);

      if (mb_str && unit) {
        let num = Number(mb_str[0]) * this.ratio[unit];

        return num;
      }
    }

    return undefined;
  }

  static unit(str: string): LengthUnitName | undefined {
    const unit = str.match(/[cdmk]?m/);

    if (unit) {
      return unit[0] as LengthUnitName;
    }
  }

  static mm(str?: string) {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["mm"];
    }

    return undefined;
  }

  static cm(str?: string) {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["cm"];
    }

    return undefined;
  }

  static m(str?: string) {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["m"];
    }

    return undefined;
  }

  static km(str?: string) {
    const num = this.read(str);

    if (num) {
      return num / this.ratio["km"];
    }

    return undefined;
  }
}

export { MemoryUnits, FrequencyUnits, LengthUnits };
