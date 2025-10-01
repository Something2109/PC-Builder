"use client";

import { ColumnWrapper } from "./FlexWrapper";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from "react";

const defaultClass = "justify-center items-center gap-4";

export default function LoadingPanel({
  text,
  className,
  ...rest
}: { text: string } & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
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
  }, []);

  return (
    <ColumnWrapper
      className={className ? defaultClass.concat(" ", className) : defaultClass}
      {...rest}
    >
      <h1 ref={LoadingText} className="block text-bold text-2xl">
        {text}
      </h1>
    </ColumnWrapper>
  );
}
