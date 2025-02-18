"use client";

import { User } from "@/utils/interface/user/User";
import {
  ActionDispatch,
  createContext,
  InputHTMLAttributes,
  useActionState,
  useContext,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { decode } from "jsonwebtoken";
import { Button, RedirectButton } from "./utils/Button";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./utils/Input";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { NotificationBar } from "./utils/NotificationBar";

const AUTH_KEY = "Authorization";
const AuthChanger = createContext<ActionDispatch<[string | null]> | null>(null);

export const AuthContext = createContext<User.JwtPayload | null>(null);

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useReducer(
    (_: User.JwtPayload | null, curr: string | null) => {
      try {
        if (curr) {
          localStorage.setItem(AUTH_KEY, curr);

          axios.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
              const token = localStorage.getItem(AUTH_KEY);
              if (token) config.headers.Authorization = `Bearer ${token}`;

              return config;
            }
          );

          return decode(curr) as User.JwtPayload;
        }
      } catch {}

      axios.interceptors.request.clear();
      localStorage.removeItem(AUTH_KEY);
      return null;
    },
    null
  );

  useLayoutEffect(() => setUser(localStorage.getItem(AUTH_KEY)), []);

  return (
    <AuthContext value={user}>
      <AuthChanger value={setUser}>{children}</AuthChanger>
    </AuthContext>
  );
}

export function LoginButton() {
  const User = useContext(AuthContext);
  const setUser = useContext(AuthChanger);
  const pathname = usePathname();

  if (pathname === "/auth/login") return;

  return (
    <RedirectButton
      href={`/auth/login?redirect=${pathname}`}
      onClick={User ? () => setUser!(null) : undefined}
    >
      {User ? "Log out" : "Log in"}
    </RedirectButton>
  );
}

type LoginError = {
  username?: string;
  password?: string;
};

export function LoginForm({ pathname }: { pathname?: string }) {
  const router = useRouter();
  const setUser = useContext(AuthChanger);
  const [error, setError] = useState<LoginError>({});
  const [state, formAction, pending] = useActionState(
    async (_: any, form: FormData) => {
      const body = Object.fromEntries(form.entries());

      try {
        const response = await axios.post("/api/auth/login", body, {
          withCredentials: true,
        });
        setUser!(response.data.access_token);
        router.push(pathname ?? "/");
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);
        setError(error.response?.data as LoginError);
      }

      return body as Record<string, string>;
    },
    {}
  );

  return (
    <form
      className="flex flex-col w-1/2 m-auto gap-1"
      action={(form) => formAction(form)}
    >
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

const InputClass = "border-2 rounded-xl px-2 py-1 text-medium";

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
        className={className ? className.concat(" ", InputClass) : InputClass}
        {...rest}
      />
    </>
  );
}
