"use client";

import { UnitInterface } from "@pc-builder/shared/Units";
import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";

import { RowWrapper } from "./FlexWrapper";
import { mergeClass } from "./mergeClass";

const defaultStyle =
  "only:w-full px-3.5 py-1.5 text-sm bg-card/45 dark:bg-card/25 backdrop-blur-sm border border-border/80 dark:border-border/60 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/15 hover:border-accent-indigo/60 text-text placeholder-text/35 disabled:opacity-50 disabled:cursor-not-allowed";
const rangeDivStyle = "relative hidden md:block flex-1 self-stretch";
const rangeInputStyle = "absolute w-full top-1/2 -translate-y-1/2 first:bg-range-input";

// Intercepts the default onChange event and proxies its target value
// to return undefined instead of empty string.
function cleanEvent<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  e: ChangeEvent<T>,
  onChange?: (e: ChangeEvent<T>) => void
) {
  if (!onChange) return;
  const proxyTarget = new Proxy(e.target, {
    get(target, prop) {
      if (prop === "value") {
        return target.value || undefined;
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

type TextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function TextArea({ className, onChange, ...rest }: TextAreaProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = textarea.current.scrollHeight + "px";
    }
  };
  useLayoutEffect(resize, []);

  return (
    <textarea
      ref={textarea}
      rows={1}
      className={mergeClass(`${defaultStyle} resize-none overflow-y-hidden`, className)}
      onInput={resize}
      onChange={(e) => {
        resize();
        cleanEvent(e, onChange);
      }}
      {...rest}
    />
  );
}

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

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

type SelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export function Select({ className, onChange, ...rest }: SelectProps) {
  return (
    <select
      className={mergeClass(
        `${defaultStyle} pr-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_0.75rem_center] bg-size-[1.25rem_1.25rem] bg-no-repeat`,
        className
      )}
      onChange={(e) => cleanEvent(e, onChange)}
      {...rest}
    />
  );
}

export function OptionSelect({ options, ...rest }: { options: string[] | number[] } & SelectProps) {
  return (
    <Select {...rest}>
      {!rest.required && (
        <option className="bg-card text-text" value={""}>
          None
        </option>
      )}
      {options.map((value) => (
        <option className="bg-card text-text" key={`options-${rest.name}-${value}`} value={value}>
          {value}
        </option>
      ))}
    </Select>
  );
}

export function ChoiceInput({
  name,
  value,
  type,
  ...rest
}: {
  type: "checkbox" | "radio";
} & Omit<InputProps, "type">) {
  const id = `choice-${type}-${name}-${value}`;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-border/80 dark:border-border bg-card/15 dark:bg-card/5 hover:bg-accent-indigo/5 hover:border-accent-indigo/40 transition-all cursor-pointer select-none text-sm text-text/85 font-medium"
    >
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        className={
          type === "checkbox"
            ? "rounded border-border/80 dark:border-border bg-transparent text-accent-indigo focus:ring-accent-indigo focus:ring-offset-background w-4 h-4 cursor-pointer"
            : "rounded-full border-border/80 dark:border-border bg-transparent text-accent-indigo focus:ring-accent-indigo focus:ring-offset-background w-4 h-4 cursor-pointer"
        }
        {...rest}
      />
      <span>{value}</span>
    </label>
  );
}

export function MultipleChoiceInput({
  className,
  value,
  defaultValue,
  ...props
}: {
  value: string[];
  defaultValue?: string[];
} & Omit<InputProps, "defaultValue" | "value">) {
  return (
    <RowWrapper className={mergeClass("flex-wrap gap-2", className)}>
      {value.map((val) => (
        <ChoiceInput
          {...props}
          type="checkbox"
          key={val}
          value={val}
          defaultChecked={defaultValue?.includes(val)}
        />
      ))}
    </RowWrapper>
  );
}

export function MinMaxRangeInput({ name, id, ...props }: InputProps) {
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const minRangeInput = useRef<HTMLInputElement>(null);
  const maxRangeInput = useRef<HTMLInputElement>(null);

  const { min, max, ...rest } = props;
  const onInput = useCallback(() => {
    const value: [number, number] = [
      Number(minInput.current!.value),
      Number(maxInput.current!.value),
    ];
    value.sort((a, b) => a - b);

    minInput.current!.value = value[0].toString();
    maxInput.current!.value = value[1].toString();
    minRangeInput.current!.value = value[0].toString();
    maxRangeInput.current!.value = value[1].toString();
  }, []);

  const onRangeInput = useCallback(() => {
    const value: [number, number] = [
      minRangeInput.current!.valueAsNumber,
      maxRangeInput.current!.valueAsNumber,
    ];
    value.sort((a, b) => a - b);

    minInput.current!.value = value[0].toString();
    maxInput.current!.value = value[1].toString();
  }, []);

  return (
    <RowWrapper className="w-full items-center gap-3 bg-card/25 dark:bg-card/15 border border-border/80 dark:border-border rounded-xl px-3.5 py-1.5 transition-all duration-200 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/15">
      <input
        {...rest}
        type="number"
        className="w-20 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-min-input`}
        defaultValue={min}
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
          defaultValue={min}
          onInput={onRangeInput}
        />
        <input
          {...props}
          ref={maxRangeInput}
          className={rangeInputStyle}
          id={`${id}-max-range`}
          type="range"
          name={name}
          defaultValue={max}
          onInput={onRangeInput}
        />
      </div>
      <input
        {...rest}
        type="number"
        className="w-20 text-center bg-transparent border-none p-0 text-sm focus:ring-0 focus:outline-none text-text placeholder-text/30 font-medium"
        id={`${id}-max-input`}
        defaultValue={max}
        ref={maxInput}
        onInput={onInput}
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

export function AutoGrowingTextArea({
  className,
  onChange,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [props.defaultValue, props.value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      onChange={(e) => {
        resize();
        cleanEvent(e, onChange);
      }}
      className={mergeClass(
        "resize-none overflow-hidden bg-transparent w-full focus:outline-none border-none p-0",
        className
      )}
      {...props}
    />
  );
}
