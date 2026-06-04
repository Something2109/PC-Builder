"use client";

import { InputHTMLAttributes } from "react";
import { NotificationBar } from "@/ui/NotificationBar";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useLoginAction } from "@/features/auth";
import { mergeClass } from "@/ui/mergeClass";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters long."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export function LoginForm({ pathname }: Readonly<{ pathname?: string }>) {
  const [state, formAction, pending, error, setError] =
    useLoginAction(pathname);

  const form = useForm({
    defaultValues: {
      username: state.username || "",
      password: state.password || "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("username", value.username);
      formData.append("password", value.password);
      formAction(formData);
    },
  });

  return (
    <form
      className="flex flex-col w-1/2 m-auto gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {error.message && (
        <NotificationBar
          message={error.message}
          remove={() => setError({})}
          alert
        />
      )}
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.username.safeParse(value);
            return res.success ? undefined : res.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <>
            <LoginField
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="text"
              required
            >
              Username:
            </LoginField>
            {field.state.meta.errors.length > 0 && (
              <div className="text-red-500 text-xs font-semibold px-1 mt-1">
                {field.state.meta.errors.join(", ")}
              </div>
            )}
          </>
        )}
      </form.Field>
      {error.username && (
        <NotificationBar
          message={error.username}
          remove={() => setError({})}
          alert
        />
      )}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const res = loginSchema.shape.password.safeParse(value);
            return res.success ? undefined : res.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <>
            <LoginField
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="password"
              required
            >
              Password:
            </LoginField>
            {field.state.meta.errors.length > 0 && (
              <div className="text-red-500 text-xs font-semibold px-1 mt-1">
                {field.state.meta.errors.join(", ")}
              </div>
            )}
          </>
        )}
      </form.Field>
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
  value,
  onChange,
  onBlur,
  ...rest
}: {
  children: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <label htmlFor={name} className="font-bold">
        {children}
      </label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        id={name}
        className={mergeClass(
          "border-2 rounded-xl px-2 py-1 text-medium",
          className
        )}
        {...rest}
      />
    </>
  );
}
