"use client";

import { ChangeEvent, RefObject, useRef } from "react";
import { UnitInterface } from "@pc-builder/shared/Units";
import { RowWrapper } from "../FlexWrapper";
import { InputProps } from "./Input";
import {
  rangeDivStyle,
  rangeInputStyle,
  TransformedChangeEvent,
  TransformedInputEvent,
  transformEvent,
} from "./base";
import { useDebounceFunction } from "@/hooks/useDebounce";

export type RangeInputChangeEvent = TransformedChangeEvent<[number, number], HTMLInputElement>;

export type RangeInputInputEvent = TransformedInputEvent<[number, number], HTMLInputElement>;

type InputRangeProps = Omit<InputProps, "value" | "defaultValue" | "onInput" | "onChange"> & {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (e: RangeInputChangeEvent) => void;
  onInput?: (e: RangeInputInputEvent) => void;
};

type ElementTuple = [HTMLInputElement | null, HTMLInputElement | null];

export function MinMaxRangeInput({
  name,
  id,
  value,
  defaultValue,
  onChange,
  onInput,
  min,
  max,
  ...rest
}: InputRangeProps) {
  const numberInputsRef = useRef<ElementTuple>([null, null]);
  const rangeInputsRef = useRef<ElementTuple>([null, null]);
  const debounce = useDebounceFunction(500);

  const getTupleValue = (ref: RefObject<ElementTuple>) => {
    const value: [number, number] = ref.current
      .map((input) => Number(input!.value))
      .sort((a, b) => a - b) as [number, number];

    if (min && value[0] < Number(min)) value[0] = Number(min);
    if (max && value[1] > Number(max)) value[1] = Number(max);

    return value;
  };

  const updateChange = (tupleValue: [number, number], e: ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      rangeInputsRef.current.forEach((input, index) => {
        input!.value = tupleValue[index].toString();
      });
      numberInputsRef.current.forEach((input, index) => {
        input!.value = tupleValue[index].toString();
      });
    }

    if (onChange) {
      const proxyTarget = transformEvent(e, () => tupleValue);
      onChange(proxyTarget);
    }
  };

  const onInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const tupleValue = getTupleValue(numberInputsRef);

    updateChange(tupleValue, e);
  };

  const onRangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const tupleValue = getTupleValue(rangeInputsRef);

    updateChange(tupleValue, e);
  };

  return (
    <RowWrapper className="w-full items-center gap-3 bg-card/25 dark:bg-card/15 border border-border/80 dark:border-border rounded-xl px-3.5 py-1.5 transition-all duration-200 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/15">
      <input
        {...rest}
        value={value?.[0]}
        type="number"
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-min-input`}
        defaultValue={defaultValue?.[0] ?? min}
        ref={(el) => {
          numberInputsRef.current[0] = el;
        }}
        onChange={(e) => debounce(onInputHandler, e)}
      />
      <div className={rangeDivStyle}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.75 bg-line/80 rounded-full pointer-events-none" />
        <input
          {...rest}
          value={value?.[0]}
          ref={(el) => {
            rangeInputsRef.current[0] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-min-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[0] ?? min}
          min={min}
          max={max}
          onChange={onRangeInputHandler}
        />
        <input
          {...rest}
          value={value?.[1]}
          ref={(el) => {
            rangeInputsRef.current[1] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-max-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[1] ?? max}
          min={min}
          max={max}
          onChange={onRangeInputHandler}
        />
      </div>
      <input
        {...rest}
        value={value?.[1]}
        type="number"
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-max-input`}
        defaultValue={defaultValue?.[1] ?? max}
        ref={(el) => {
          numberInputsRef.current[1] = el;
        }}
        onChange={(e) => debounce(onInputHandler, e)}
      />
    </RowWrapper>
  );
}

type UnitValue<T extends string> = [number, T];

type UnitTupleValue<T extends string> = [UnitValue<T>, UnitValue<T>];

export function UnitMinMaxRangeInput<T extends string>({
  Unit,
  defaultUnit,
  name,
  id,
  value,
  defaultValue,
  onChange,
  onInput,
  min,
  max,
  ...props
}: {
  Unit: UnitInterface<T>;
  defaultUnit: NoInfer<T>;
} & InputRangeProps) {
  const numberInputsRef = useRef<ElementTuple>([null, null]);
  const rangeInputsRef = useRef<ElementTuple>([null, null]);
  const debounce = useDebounceFunction(500);

  const getTupleValue = (ref: RefObject<ElementTuple>) => {
    const rawValue = ref.current
      .map((input) => Unit.parse(input!.value))
      .filter((val): val is UnitValue<T> => Boolean(val) && val?.[0] !== null);

    if (rawValue.length < 2) return null;

    const value = rawValue.sort(
      (a, b) => a[0] - Unit.exchange(b[0], b[1], a[1])
    ) as UnitTupleValue<T>;

    return value;
  };

  const updateChange = (tupleValue: UnitTupleValue<T>, e: ChangeEvent<HTMLInputElement>) => {
    const numberValue = tupleValue.map(([val, unit]) => Unit.exchange(val, unit, defaultUnit)) as [
      number,
      number,
    ];

    if (!value) {
      rangeInputsRef.current.forEach((input, index) => {
        input!.value = numberValue[index].toString();
      });
      numberInputsRef.current.forEach((input, index) => {
        input!.value = `${tupleValue[index][0]} ${tupleValue[index][1]}`;
      });
    }

    if (onChange) {
      const proxyTarget = transformEvent(e, () => numberValue);
      onChange(proxyTarget);
    }
  };

  const onInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const tupleValue = getTupleValue(numberInputsRef);

    if (!tupleValue) return;

    updateChange(tupleValue, e);
  };

  const onRangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const tupleValue = rangeInputsRef.current.map((input) => {
      const val = Number(input!.value);
      return [val, defaultUnit];
    }) as UnitTupleValue<T>;

    if (!tupleValue) return;

    updateChange(tupleValue, e);
  };

  const toDefaultUnitValue = (val: string | number | undefined) =>
    val ? `${val} ${defaultUnit}` : undefined;

  return (
    <RowWrapper className="w-full items-center gap-3 bg-card/25 dark:bg-card/15 border border-border/80 dark:border-border rounded-xl px-3.5 py-1.5 transition-all duration-200 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/15">
      <input
        {...props}
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-min-input`}
        defaultValue={toDefaultUnitValue(defaultValue?.[0] ?? min)}
        ref={(el) => {
          numberInputsRef.current[0] = el;
        }}
        onChange={(e) => debounce(onInputHandler, e)}
      />
      <div className={rangeDivStyle}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.75 bg-line/80 rounded-full pointer-events-none" />
        <input
          {...props}
          value={value?.[0]}
          ref={(el) => {
            rangeInputsRef.current[0] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-min-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[0] ?? min}
          min={min}
          max={max}
          onChange={onRangeInputHandler}
        />
        <input
          {...props}
          value={value?.[1]}
          ref={(el) => {
            rangeInputsRef.current[1] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-max-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[1] ?? max}
          min={min}
          max={max}
          onChange={onRangeInputHandler}
        />
      </div>
      <input
        {...props}
        value={value?.[1]}
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-max-input`}
        defaultValue={toDefaultUnitValue(defaultValue?.[1] ?? max)}
        ref={(el) => {
          numberInputsRef.current[1] = el;
        }}
        onChange={(e) => debounce(onInputHandler, e)}
      />
    </RowWrapper>
  );
}
