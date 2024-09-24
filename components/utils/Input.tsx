"use client";

import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from "react";

const defaultStyle = "w-full bg-transparent resize-none overflow-y-hidden px-1";

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
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const classList = [defaultStyle];
  if (className) {
    classList.push(className);
  }

  return <input className={classList.join(" ")} {...rest} />;
}
