import Link from "next/link";
import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  HTMLAttributes,
} from "react";

const normal =
  "rounded-lg lg:rounded-xl border-2 border-line p-1 md:border-4 hover:border-blue-500";
const dark = "dark:hover:bg-blue-500";

function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  let classList = [normal, dark];
  if (className) {
    classList.push(className);
  }

  return <button type="button" className={classList.join(" ")} {...rest} />;
}

function RedirectButton({ className, ...rest }: Parameters<typeof Link>[0]) {
  let classList = [normal, dark];
  if (className) {
    classList.push(className);
  }

  return <Link className={classList.join(" ")} {...rest} />;
}

export { Button, RedirectButton };
