"use client";

import { UnitInterface } from "@pc-builder/shared/Units";
import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useCallback, useRef } from "react";

import { RowWrapper } from "../FlexWrapper";
import { mergeClass } from "../mergeClass";
import { defaultStyle, cleanEvent } from "./base";

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function Input({ className, onChange, ...rest }: InputProps) {
  return (
    <input
      className={mergeClass(defaultStyle, className)}
      onChange={(e) => cleanEvent(e, onChange)}
      {...rest}
    />
  );
}

export function SuffixInput({ suffix, ...rest }: { suffix: string } & InputProps) {
  return (
    <RowWrapper className="items-center gap-2 w-full">
      <Input {...rest} />
      <span className="text-sm font-semibold text-text/65 whitespace-nowrap bg-border/40 px-3 py-1.5 rounded-xl border border-border/60">
        {suffix}
      </span>
    </RowWrapper>
  );
}

export function UnitInput<T extends string>({
  Unit,
  defaultUnit,
  name,
  defaultValue,
  onChange,
  ...rest
}: {
  Unit: UnitInterface<T>;
  defaultUnit: NoInfer<T>;
} & Omit<InputProps, "type">) {
  const SubmitInput = useRef<HTMLInputElement>(null);
  defaultValue = defaultValue ?? 0;

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      const [num, unit] = Unit.parse(value) ?? [null, null];
      let finalValue: string = "0";

      if (num) {
        e.currentTarget.value = `${num} ${unit}`;
        finalValue = Unit.exchange(num, unit, defaultUnit).toString();
      } else {
        e.currentTarget.value = "";
      }

      SubmitInput.current!.value = finalValue;

      if (onChange) {
        const proxyTarget = new Proxy(SubmitInput.current!, {
          get(target, prop) {
            if (prop === "value") {
              return finalValue;
            }
            const value = Reflect.get(target, prop);
            if (typeof value === "function") {
              return value.bind(target);
            }
            return value;
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
        });
        onChange(proxyEvent);
      }
    },
    [defaultUnit, Unit, onChange]
  );

  return (
    <>
      <input type="hidden" ref={SubmitInput} name={name} value={defaultValue} />
      <Input defaultValue={`${defaultValue} ${defaultUnit}`} onChange={onChangeInput} {...rest} />
    </>
  );
}
