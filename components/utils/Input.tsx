"use client";

import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

const defaultStyle = "w-full bg-transparent resize-none overflow-y-hidden";
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
