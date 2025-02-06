export class FilterOptionBuilder<T extends Record<string, any>> {
  private result: T | null = null;

  add(key: keyof T, value?: T[typeof key]) {
    if (value) {
      if (!this.result) this.result = {} as T;

      this.result[key] = value;
    }
    return this;
  }

  build() {
    return this.result;
  }
}
