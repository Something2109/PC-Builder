"use client";

import { useState } from "react";

import { UnitInterface } from "@pc-builder/shared/Units";

import { RowWrapper } from "./FlexWrapper";
import { OptionSelect } from "./Input";

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
}: Readonly<{
  defaultValue?: number | null;
  Unit: UnitInterface<T>;
  defaultUnit: NoInfer<T>;
  displayUnit?: NoInfer<T>[];
}>) {
  const [unitName, setUnit] = useState<T>(defaultUnit);

  if (!defaultValue) return undefined;

  displayUnit ??= Unit.list();
  const value = Unit.exchange(defaultValue, defaultUnit, unitName);

  return (
    <RowWrapper className="items-baseline">
      <p>{value}</p>
      <OptionSelect
        className="disabled:text-line"
        title="Unit Change"
        onChange={(e) => setUnit(e.currentTarget.value as T)}
        value={unitName}
        options={displayUnit}
        disabled={displayUnit.length === 1}
        required
      />
    </RowWrapper>
  );
}
