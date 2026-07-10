"use client";

import { Children, HTMLAttributes, ReactNode } from "react";

import { ColumnWrapper } from "./FlexWrapper";

function VerticalCollapsible({
  children,
  className,
  open = true,
  ...detailsAttributes
}: {
  children: ReactNode;
  open?: boolean;
  name?: string;
} & HTMLAttributes<HTMLDetailsElement>) {
  const [header, ...rest] = Children.toArray(children);

  return (
    <details className={className} open={open} suppressHydrationWarning {...detailsAttributes}>
      <summary className="flex flex-row gap-2 w-full m-0 justify-between cursor-pointer select-none outline-none [&::-webkit-details-marker]:hidden">
        {header}
      </summary>

      <ColumnWrapper className="h-fit">{rest}</ColumnWrapper>
    </details>
  );
}

export { VerticalCollapsible };
