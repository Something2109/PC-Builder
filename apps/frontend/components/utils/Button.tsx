import Link from "next/link";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { mergeClass } from "./mergeClass";

const normal = "button dark:hover:bg-blue-500";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

function Button({ className, ...rest }: ButtonProps) {
  return <button className={mergeClass(normal, className)} {...rest} />;
}

function RedirectButton({ className, ...rest }: Parameters<typeof Link>[0]) {
  return <Link className={mergeClass(normal, className)} {...rest} />;
}

function DeleteButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      type="button"
      className={mergeClass(
        "absolute right-2 bottom-1/2 translate-y-1/2 border-0 p-0 aspect-square h-6",
        className
      )}
      {...props}
    >
      x
    </Button>
  );
}

export { Button, RedirectButton, DeleteButton };
