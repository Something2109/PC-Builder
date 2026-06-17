"use client";

import { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from "react";

import { ColumnWrapper } from "./FlexWrapper";
import { mergeClass } from "./mergeClass";

export default function LoadingPanel({
  text,
  className,
  ...rest
}: { text: string } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const LoadingText = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => {
      if (LoadingText.current) {
        dots = (dots + 1) % 5;
        LoadingText.current.innerHTML = text + ".".repeat(dots);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <ColumnWrapper className={mergeClass("justify-center items-center gap-4", className)} {...rest}>
      <h1 ref={LoadingText} className="block text-bold text-2xl">
        {text}
      </h1>
    </ColumnWrapper>
  );
}
