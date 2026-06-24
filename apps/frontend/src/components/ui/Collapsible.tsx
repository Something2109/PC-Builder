"use client";

import { HTMLAttributes, useState } from "react";

import { ColumnWrapper } from "./FlexWrapper";
import { mergeClass } from "./mergeClass";

function VerticalCollapsible({
  children,
  className,
  ...divAttributes
}: {
  children: Iterable<React.ReactNode>;
} & HTMLAttributes<HTMLDivElement>) {
  const [collapse, setCollapse] = useState(true);
  const [header, ...rest] = [...children];

  return (
    <ColumnWrapper className={mergeClass("gap-4", className)} {...divAttributes}>
      <button
        type="button"
        className="flex flex-row gap-2 w-full m-0 justify-between"
        onClick={() => setCollapse(!collapse)}
      >
        <div className="flex-1 text-left">{header}</div>
        <span className="font-bold">{collapse ? "+" : "-"}</span>
      </button>

      {collapse && <ColumnWrapper className={`h-fit overflow-auto`}>{rest}</ColumnWrapper>}
    </ColumnWrapper>
  );
}

export { VerticalCollapsible };
