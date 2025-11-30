"use client";

import { RowWrapper } from "./FlexWrapper";
import { OptionSelect } from "./Input";
import { UnitInterface } from "@/utils/Units";
import { ChangeEvent, useCallback, useRef, useState } from "react";

export function SuffixDisplay({
  suffix,
  children,
}: {
  suffix: string;
  children?: string | number | null;
}) {
  return children && `${children} ${suffix}`;
}

export function UnitDisplay<T extends string>({
  defaultValue,
  Unit,
  defaultUnit,
  displayUnit,
}: {
  defaultValue?: number | null;
  Unit: UnitInterface<T>;
  defaultUnit: NoInfer<T>;
  displayUnit?: NoInfer<T>[];
}) {
  if (!defaultValue) return undefined;

  const [unitName, setUnit] = useState<T>(defaultUnit);
  const display = useRef<T[]>(displayUnit ?? Unit.list());
  const value = useRef<number>(defaultValue);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const unitName = e.currentTarget.value as T;
      value.current = Unit.exchange(defaultValue, defaultUnit, unitName);
      setUnit(unitName);
    },
    [Unit]
  );

  return (
    <RowWrapper className="items-baseline">
      <p>{value.current}</p>
      <OptionSelect
        className="disabled:text-line"
        title="Unit Change"
        onChange={onChange}
        value={unitName}
        options={display.current}
        disabled={display.current.length === 1}
        required
      />
    </RowWrapper>
  );
}
