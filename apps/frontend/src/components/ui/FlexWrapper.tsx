import { HTMLAttributes } from "react";

import { mergeClass } from "./mergeClass";

type WrapperProps = Readonly<HTMLAttributes<HTMLDivElement>>;

export function RowWrapper({ className, ...rest }: WrapperProps) {
  return <div className={mergeClass("flex flex-row gap-1", className)} {...rest} />;
}

export function ColumnWrapper({ className, ...rest }: WrapperProps) {
  return <div className={mergeClass("flex flex-col gap-1", className)} {...rest} />;
}

export function ResponsiveWrapper({ className, ...rest }: WrapperProps) {
  return <div className={mergeClass("flex flex-col lg:flex-row gap-1", className)} {...rest} />;
}
