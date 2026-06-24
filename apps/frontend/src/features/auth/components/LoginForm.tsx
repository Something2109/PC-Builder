"use client";

import { useForm } from "@tanstack/react-form";
import { ChangeEvent, InputHTMLAttributes, useState, startTransition } from "react";
import { z } from "zod";

import { useLoginAction } from "@/features/auth";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { mergeClass } from "@/ui/mergeClass";
import { NotificationBar } from "@/ui/NotificationBar";

const loginSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters long."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export function LoginForm({ pathname }: Readonly<{ pathname?: string }>) {
  const [state, formAction, pending, error, setError] = useLoginAction(pathname);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      username: state.username || "",
      password: state.password || "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("username", value.username);
      formData.append("password", value.password);
      startTransition(() => {
        formAction(formData);
      });
    },
  });

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/65 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent-indigo/5">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-heading tracking-tight text-text">Welcome Back</h2>
          <p className="text-sm text-text/60 mt-2">
            Log in to customize your PC builds and view compatibility.
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {error.message && (
            <NotificationBar message={error.message} remove={() => setError({})} alert />
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
            {(field) => {
              const fieldError = field.state.meta.errors.join(", ") || error.username;
              return (
                <div className="flex flex-col">
                  <LoginField
                    label="Username"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      if (error.username) {
                        setError((prev) => ({ ...prev, username: undefined }));
                      }
                    }}
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    error={!!fieldError}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    }
                  />
                  {fieldError && (
                    <p className="text-red-500 dark:text-red-400 text-xs font-medium px-1 mt-1.5 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const res = loginSchema.shape.password.safeParse(value);
                return res.success ? undefined : res.error.issues[0]?.message;
              },
            }}
          >
            {(field) => {
              const fieldError = field.state.meta.errors.join(", ") || error.password;
              return (
                <div className="flex flex-col">
                  <LoginField
                    label="Password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      if (error.password) {
                        setError((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    error={!!fieldError}
                    togglePassword
                    showPasswordState={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.75"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    }
                  />
                  {fieldError && (
                    <p className="text-red-500 dark:text-red-400 text-xs font-medium px-1 mt-1.5 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <Button
            type="submit"
            disabled={pending}
            className="w-full mt-6 py-3 px-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-indigo to-accent-cyan hover:opacity-90 active:scale-[0.98] text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-accent-indigo/10 hover:shadow-lg hover:shadow-accent-indigo/20 border-0"
          >
            {pending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface LoginFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  icon: React.ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  togglePassword?: boolean;
  onTogglePassword?: () => void;
  showPasswordState?: boolean;
}

function LoginField({
  label,
  icon,
  name,
  value,
  onChange,
  onBlur,
  error,
  type,
  togglePassword,
  onTogglePassword,
  showPasswordState,
  ...rest
}: LoginFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full mt-4">
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-text/60 px-0.5"
      >
        {label}
      </label>
      <div
        className={mergeClass(
          "relative flex items-center w-full border rounded-xl bg-background/30 backdrop-blur-sm transition-all duration-200 px-3.5 py-2.5",
          error
            ? "border-red-500/50 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10"
            : "border-border/80 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/10"
        )}
      >
        <div className="absolute left-3.5 text-text/40 flex items-center justify-center pointer-events-none">
          {icon}
        </div>
        <Input
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          id={name}
          type={type}
          className="w-full bg-transparent border-0 p-0 pl-7 pr-8 text-sm focus:ring-0 focus:outline-none placeholder:text-text/30"
          {...rest}
        />
        {togglePassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 text-text/40 hover:text-text/70 transition-colors focus:outline-none focus:text-text/80 p-1 rounded-lg cursor-pointer"
            aria-label={showPasswordState ? "Hide password" : "Show password"}
          >
            {showPasswordState ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
