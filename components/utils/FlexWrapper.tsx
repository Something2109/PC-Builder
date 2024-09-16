import { HTMLAttributes } from "react";

export function RowWrapper({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  let classList = ["flex flex-row gap-1"];
  if (className) {
    classList.push(className);
  }

  return <div className={classList.join(" ")} {...rest} />;
}

export function ColumnWrapper({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  let classList = ["flex flex-col gap-1"];
  if (className) {
    classList.push(className);
  }

  return <div className={classList.join(" ")} {...rest} />;
}
