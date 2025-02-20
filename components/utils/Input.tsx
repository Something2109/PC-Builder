"use client";

import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RowWrapper } from "./FlexWrapper";
import { UnitInterface } from "@/utils/extract/Units";

const defaultStyle = "only:w-full bg-transparent resize-none overflow-y-hidden";

export function TextArea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  let classList = [defaultStyle, "px-1"];
  if (className) {
    classList.push(className);
  }

  const textarea = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    textarea.current!.style.height = "auto";
    textarea.current!.style.height = textarea.current!.scrollHeight + "px";
  };
  useEffect(resize, []);

  return (
    <textarea
      ref={textarea}
      rows={1}
      className={classList.join(" ")}
      onInput={resize}
      {...rest}
    />
  );
}

export function Input({
  className,
  type,
  defaultValue,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const classList = [defaultStyle, "px-1"];
  if (className) {
    classList.push(className);
  }

  return (
    <input
      className={classList.join(" ")}
      type={type}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}

export function SuffixInput({
  suffix,
  ...rest
}: { suffix: string } & InputHTMLAttributes<HTMLInputElement>) {
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
  ...rest
}: {
  Unit: UnitInterface<T>;
  defaultUnit: T;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [submit, setSubmit] = useState<number>(Number(defaultValue ?? 0));
  rest.onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      const result = Unit.parse(value);
      if (result && result[0]) {
        e.currentTarget.value = `${result[0]} ${result[1]}`;
        setSubmit(Unit.exchange(result[0], result[1], defaultUnit));
      } else {
        setSubmit(0);
      }
    },
    [Unit]
  );

  return (
    <>
      <input type="hidden" name={name} value={submit} />
      <Input defaultValue={`${submit} ${defaultUnit}`} {...rest} />
    </>
  );
}

export function Select({
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const classList = [defaultStyle];
  if (className) {
    classList.push(className);
  }

  return <select className={classList.join(" ")} {...rest} />;
}

export function OptionSelect({
  options,
  ...rest
}: { options: string[] | number[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Select {...rest}>
      {options.map((value) => (
        <option
          className="text-background"
          key={`${rest.name ?? new Date().getTime()}-${value}`}
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
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = `choice-${type}-${name}-${value}`;

  return (
    <RowWrapper>
      <input type={type} id={id} name={name} value={value} {...rest} />
      <label htmlFor={id}>{value}</label>
    </RowWrapper>
  );
}
