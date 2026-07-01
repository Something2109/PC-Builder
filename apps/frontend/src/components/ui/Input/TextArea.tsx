"use client";

import {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";

import { mergeClass } from "../mergeClass";
import { defaultStyle, cleanEvent } from "./base";

export type TextAreaProps = DetailedHTMLProps<
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
