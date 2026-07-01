"use client";

import {
  ChangeEvent,
  InputEvent,
  useCallback,
  useRef,
} from "react";
import { UnitInterface } from "@pc-builder/shared/Units";
import { RowWrapper } from "../FlexWrapper";
import { InputProps } from "./Input";
import { rangeDivStyle, rangeInputStyle } from "./base";

type RangeInputChangeEvent = ChangeEvent<
  Omit<HTMLInputElement, "value" | "defaultValue"> & {
    value?: [number, number];
    defaultValue?: [number, number];
  }
>;

type RangeInputInputEvent = InputEvent<
  Omit<HTMLInputElement, "value" | "defaultValue"> & {
    value?: [number, number];
    defaultValue?: [number, number];
  }
>;

type InputRangeProps = Omit<InputProps, "value" | "defaultValue" | "onInput" | "onChange"> & {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (e: RangeInputChangeEvent) => void;
  onInput?: (e: RangeInputInputEvent) => void;
};

export function MinMaxRangeInput({
  name,
  id,
  value,
  defaultValue,
  onInput,
  ...props
}: InputRangeProps) {
  const minInput = useRef<[HTMLInputElement | null, HTMLInputElement | null]>([null, null]);
  const minRangeInput = useRef<[HTMLInputElement | null, HTMLInputElement | null]>([null, null]);

  const { min, max, ...rest } = props;
  const onInputHandler = useCallback(
    (e: InputEvent<HTMLInputElement>) => {
      const value = minInput.current.map((input) => Number(input!.value)).sort((a, b) => a - b) as [
        number,
        number,
      ];

      minRangeInput.current.forEach((input, index) => {
        input!.value = value[index].toString();
      });

      const proxyTarget = new Proxy(e.currentTarget, {
        get(target, prop) {
          if (prop === "value") {
            return value;
          }
          const val = Reflect.get(target, prop);
          if (typeof val === "function") {
            return val.bind(target);
          }
          return val;
        },
        set(target, prop, value) {
          return Reflect.set(target, prop, value);
        },
      });
      const proxyEvent = new Proxy(e, {
        get(target, prop) {
          if (prop === "target" || prop === "currentTarget") {
            return proxyTarget;
          }
          const value = Reflect.get(target, prop);
          if (typeof value === "function") {
            return value.bind(target);
          }
          return value;
        },
      }) as unknown as RangeInputInputEvent;

      onInput?.(proxyEvent);
    },
    [onInput]
  );

  const onRangeInputHandler = useCallback(() => {
    const value: [number, number] = minRangeInput.current
      .map((input) => Number(input!.value))
      .sort((a, b) => a - b) as [number, number];

    minInput.current.forEach((input, index) => {
      input!.value = value[index].toString();
    });
  }, []);

  return (
    <RowWrapper className="w-full items-center gap-3 bg-card/25 dark:bg-card/15 border border-border/80 dark:border-border rounded-xl px-3.5 py-1.5 transition-all duration-200 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/15">
      <input
        {...rest}
        value={value?.[0]}
        type="number"
        className="w-20 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-min-input`}
        defaultValue={defaultValue?.[0] ?? min}
        ref={(el) => {
          minInput.current[0] = el;
        }}
        onInput={onInputHandler}
      />
      <div className={rangeDivStyle}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.75 bg-line/80 rounded-full pointer-events-none" />
        <input
          {...props}
          value={value?.[0]}
          ref={(el) => {
            minRangeInput.current[0] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-min-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[0] ?? min}
          onInput={onRangeInputHandler}
        />
        <input
          {...props}
          value={value?.[1]}
          ref={(el) => {
            minRangeInput.current[1] = el;
          }}
          className={rangeInputStyle}
          id={`${id}-max-range`}
          type="range"
          name={name}
          defaultValue={defaultValue?.[1] ?? max}
          onInput={onRangeInputHandler}
        />
      </div>
      <input
        {...rest}
        value={value?.[1]}
        type="number"
        className="w-20 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-max-input`}
        defaultValue={defaultValue?.[1] ?? max}
        ref={(el) => {
          minInput.current[1] = el;
        }}
        onInput={onInputHandler}
      />
    </RowWrapper>
  );
}

export function UnitMinMaxRangeInput<T extends string>({
  Unit,
  defaultUnit,
  name,
  id,
  ...props
}: {
  Unit: UnitInterface<T>;
  defaultUnit: NoInfer<T>;
} & Omit<InputProps, "type">) {
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const minRangeInput = useRef<HTMLInputElement>(null);
  const maxRangeInput = useRef<HTMLInputElement>(null);

  const onInput = useCallback(() => {
    const min = Unit.parse(minInput.current!.value);
    const max = Unit.parse(maxInput.current!.value);

    if (!min?.[0] || !max?.[0]) return;

    const value = [min, max];
    value.sort((a, b) => a[0]! - Unit.exchange(b[0]!, b[1], a[1]));

    minRangeInput.current!.value = Unit.exchange(value[0][0]!, value[0][1], defaultUnit).toString();
    maxRangeInput.current!.value = Unit.exchange(value[1][0]!, value[1][1], defaultUnit).toString();
    minInput.current!.value = `${value[0][0]} ${value[0][1]}`;
    maxInput.current!.value = `${value[1][0]} ${value[1][1]}`;
  }, [Unit, defaultUnit]);

  const onRangeInput = useCallback(() => {
    const value: [number, number] = [
      minRangeInput.current!.valueAsNumber,
      maxRangeInput.current!.valueAsNumber,
    ];
    value.sort((a, b) => a - b);

    minInput.current!.value = `${value[0]} ${defaultUnit}`;
    maxInput.current!.value = `${value[1]} ${defaultUnit}`;
  }, [defaultUnit]);

  return (
    <RowWrapper className="w-full items-center gap-3 bg-card/25 dark:bg-card/15 border border-border/80 dark:border-border rounded-xl px-3.5 py-1.5 transition-all duration-200 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/15">
      <input
        {...props}
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-min-input`}
        defaultValue={`${props.min} ${defaultUnit}`}
        ref={minInput}
        onInput={onInput}
      />
      <div className={rangeDivStyle}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.75 bg-line/80 rounded-full pointer-events-none" />
        <input
          {...props}
          ref={minRangeInput}
          className={rangeInputStyle}
          id={`${id}-min-range`}
          type="range"
          name={name}
          defaultValue={props.min}
          onInput={onRangeInput}
        />
        <input
          {...props}
          ref={maxRangeInput}
          className={rangeInputStyle}
          id={`${id}-max-range`}
          type="range"
          name={name}
          defaultValue={props.max}
          onInput={onRangeInput}
        />
      </div>
      <input
        {...props}
        className="w-16 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-max-input`}
        defaultValue={`${props.max} ${defaultUnit}`}
        ref={maxInput}
        onInput={onInput}
      />
    </RowWrapper>
  );
}
