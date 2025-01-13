import Link from "next/link";
import { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

const normal =
  "block cursor-pointer rounded-lg lg:rounded-xl border-2 border-line p-1 md:border-4 text-center font-medium";
const light = "hover:border-blue-500 hover:bg-line";
const dark = "dark:hover:bg-blue-500";

function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  let classList = [normal, light, dark];
  if (className) {
    classList.push(className);
  }

  return <button type="button" className={classList.join(" ")} {...rest} />;
}

function SubmitButton({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  let classList = [normal, light, dark];
  if (className) {
    classList.push(className);
  }

  return <input type="submit" className={classList.join(" ")} {...rest} />;
}

function InputButton({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  let classList = [normal, light, dark];
  if (className) {
    classList.push(className);
  }

  return <input className={classList.join(" ")} {...rest} />;
}

function RedirectButton({ className, ...rest }: Parameters<typeof Link>[0]) {
  let classList = [normal, light, dark];
  if (className) {
    classList.push(className);
  }

  return <Link className={classList.join(" ")} {...rest} />;
}

export { Button, SubmitButton, InputButton, RedirectButton };
