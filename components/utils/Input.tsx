"use client";

import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

const defaultStyle = "w-full bg-transparent resize-none overflow-y-hidden px-1";
const defaultValueList: { [key in HTMLInputTypeAttribute]?: string | number } =
  {
    text: "",
    date: new Date().toISOString().slice(0, 10),
    number: 0,
  };

export function TextArea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  let classList = [defaultStyle];
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
  const classList = [defaultStyle];
  if (className) {
    classList.push(className);
  }
  if (type) {
    defaultValue = defaultValue ?? defaultValueList[type] ?? undefined;
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
