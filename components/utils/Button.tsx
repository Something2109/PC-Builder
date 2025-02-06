import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

const normal =
  "block cursor-pointer rounded-lg lg:rounded-xl border-2 border-line p-1 md:border-4 text-center font-medium";
const hover_link = "hover:border-blue-500 hover:bg-line dark:hover:bg-blue-500";
const hover_button =
  "enabled:hover:border-blue-500 enabled:hover:bg-line dark:enabled:hover:bg-blue-500";

function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  let classList = [normal, hover_button];
  if (className) {
    classList.push(className);
  }

  return <button className={classList.join(" ")} {...rest} />;
}

function RedirectButton({ className, ...rest }: Parameters<typeof Link>[0]) {
  let classList = [normal, hover_link];
  if (className) {
    classList.push(className);
  }

  return <Link className={classList.join(" ")} {...rest} />;
}

export { Button, RedirectButton };
