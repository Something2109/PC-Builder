import { Button } from "@/components/utils/Button";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function DeleteButton({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <Button
      type="button"
      className="absolute right-2 bottom-1/2 translate-y-1/2 border-0 p-0 aspect-square h-6"
      {...props}
    >
      x
    </Button>
  );
}
