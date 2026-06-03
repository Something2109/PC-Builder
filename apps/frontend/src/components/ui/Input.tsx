"use client";

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
import { UnitInterface } from "@/utils/Units";
import { mergeClass } from "./mergeClass";

const defaultStyle = "only:w-full bg-transparent resize-none overflow-y-hidden";
const rangeDivStyle = "relative hidden md:block w-full top-1.5";
const rangeInputStyle = "absolute w-full first:bg-range-input";

type TextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function TextArea({ className, ...rest }: TextAreaProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    textarea.current!.style.height = "auto";
    textarea.current!.style.height = textarea.current!.scrollHeight + "px";
  };
  useLayoutEffect(resize, []);

  return (
    <textarea
      ref={textarea}
      rows={1}
      className={mergeClass(`${defaultStyle} px-1`, className)}
      onInput={resize}
      {...rest}
    />
  );
}

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({ className, type, defaultValue, ...rest }: InputProps) {
  return (
    <input
      className={mergeClass(`${defaultStyle} px-1`, className)}
      type={type}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}

export function SuffixInput({
  suffix,
  ...rest
}: { suffix: string } & InputProps) {
  return (
    <RowWrapper className="items-baseline">
      <Input {...rest} />
      <p>{suffix}</p>
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

      const result = Unit.parse(value);
      if (result?.[0]) {
        e.currentTarget.value = `${result[0]} ${result[1]}`;
        SubmitInput.current!.value = Unit.exchange(
          result[0],
          result[1],
          defaultUnit
        ).toString();
      } else {
        SubmitInput.current!.value = "0";
      }

      e.currentTarget = SubmitInput.current!;
      e.target = SubmitInput.current!;

      onChange?.call(onChange, e);
    },
    [defaultUnit, Unit, onChange]
  );

  return (
    <>
      <input type="hidden" ref={SubmitInput} name={name} value={defaultValue} />
      <Input
        defaultValue={`${defaultValue} ${defaultUnit}`}
        onChange={onChangeInput}
        {...rest}
      />
    </>
  );
}

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export function Select({ className, ...rest }: SelectProps) {
  return <select className={mergeClass(defaultStyle, className)} {...rest} />;
}

export function OptionSelect({
  options,
  ...rest
}: { options: string[] | number[] } & SelectProps) {
  return (
    <Select {...rest}>
      {!rest.required && (
        <option className="text-background" value={""}>
          None
        </option>
      )}
      {options.map((value) => (
        <option
          className="text-background"
          key={`options-${rest.name}-${value}`}
          value={value}
        >
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
    <RowWrapper>
      <input type={type} id={id} name={name} value={value} {...rest} />
      <label htmlFor={id}>{value}</label>
    </RowWrapper>
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
    <RowWrapper className={className}>
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
    <RowWrapper className="overflow-clip">
      <input
        {...rest}
        type="number"
        className={`${defaultStyle} text-right w-32`}
        id={`${id}-min-input`}
        defaultValue={min}
        ref={minInput}
        onInput={onInput}
      />
      <div className={rangeDivStyle}>
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
      <span className="md:hidden">-</span>
      <input
        {...rest}
        type="number"
        className={`${defaultStyle} text-left w-32`}
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

    minRangeInput.current!.value = Unit.exchange(
      value[0][0]!,
      value[0][1],
      defaultUnit
    ).toString();
    maxRangeInput.current!.value = Unit.exchange(
      value[1][0]!,
      value[1][1],
      defaultUnit
    ).toString();
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
    <RowWrapper className="overflow-clip">
      <input
        {...props}
        className={`${defaultStyle} text-right w-32`}
        id={`${id}-min-input`}
        defaultValue={`${props.min} ${defaultUnit}`}
        ref={minInput}
        onInput={onInput}
      />
      <div className={rangeDivStyle}>
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
      <span className="md:hidden">-</span>
      <input
        {...props}
        className={`${defaultStyle} text-left w-32`}
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
        if (props.onChange) props.onChange(e);
      }}
      className={mergeClass(
        "resize-none overflow-hidden bg-transparent w-full focus:outline-none border-none p-0",
        className
      )}
      {...props}
    />
  );
}

