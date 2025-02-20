import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

const normal = "button dark:hover:bg-blue-500";

function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={className ? className.concat(" ", normal) : normal}
      {...rest}
    />
  );
}

function RedirectButton({ className, ...rest }: Parameters<typeof Link>[0]) {
  return (
    <Link
      className={className ? className.concat(" ", normal) : normal}
      {...rest}
    />
  );
}

export { Button, RedirectButton };
