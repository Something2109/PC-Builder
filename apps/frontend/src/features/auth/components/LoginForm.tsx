"use client";

import { InputHTMLAttributes } from "react";
import { NotificationBar } from "@/ui/NotificationBar";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useLoginAction } from "@/features/auth";
import { mergeClass } from "@/ui/mergeClass";

export function LoginForm({ pathname }: Readonly<{ pathname?: string }>) {
  const [state, formAction, pending, error, setError] =
    useLoginAction(pathname);

  return (
    <form
      className="flex flex-col w-1/2 m-auto gap-1"
      action={(form) => formAction(form)}
    >
      {error.message && (
        <NotificationBar
          message={error.message}
          remove={() => setError({})}
          alert
        />
      )}
      <LoginField
        name="username"
        id="username"
        minLength={8}
        defaultValue={state.username}
        required
      >
        Username:
      </LoginField>
      {error.username && (
        <NotificationBar
          message={error.username}
          remove={() => setError({})}
          alert
        />
      )}
      <LoginField
        type="password"
        name="password"
        id="password"
        minLength={8}
        defaultValue={state.password}
        required
      >
        Password:
      </LoginField>
      {error.password && (
        <NotificationBar
          message={error.password}
          remove={() => setError({})}
          alert
        />
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

function LoginField({
  className,
  children,
  name,
  id,
  ...rest
}: {
  children: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <label htmlFor={id} className="font-bold">
        {children}
      </label>
      <Input
        name={name}
        id={id}
        className={mergeClass(
          "border-2 rounded-xl px-2 py-1 text-medium",
          className
        )}
        {...rest}
      />
    </>
  );
}
