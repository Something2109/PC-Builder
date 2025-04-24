"use client";

import { Input } from "./utils/Input";
import { Button, RedirectButton } from "./utils/Button";
import { NotificationBar } from "./utils/NotificationBar";
import { ColumnWrapper } from "./utils/FlexWrapper";
import { User } from "@/utils/interface/user/User";
import { Roles } from "@/utils/Enum";
import {
  ActionDispatch,
  ButtonHTMLAttributes,
  createContext,
  InputHTMLAttributes,
  useActionState,
  useCallback,
  useContext,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { decode, JwtPayload } from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

const AUTH_KEY = "Authorization";
const LoginPath = "/auth/login";
const AuthContext = createContext<
  [User.JwtPayload | null, ActionDispatch<[string | null]>]
>([null, () => {}]);

export function useAuth() {
  const [user, _] = useContext(AuthContext);
  return user;
}

function decodeToken(token: string | null) {
  const payload = decode(token ?? "") as JwtPayload | null;

  if (!payload) return null;

  if (payload.exp || payload.iat) {
    const current = new Date().getTime() / 1000;

    if (payload.exp && payload.exp < current) return null;

    if (payload.nbf && payload.nbf > current) return null;
  }

  return payload.sub as any as User.JwtPayload;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useReducer(
    (_: User.JwtPayload | null, curr: string | null) => {
      const userInfo = decodeToken(curr ?? "");

      curr && userInfo
        ? localStorage.setItem(AUTH_KEY, curr)
        : localStorage.removeItem(AUTH_KEY);

      return userInfo;
    },
    null,
    () => decodeToken(localStorage?.getItem(AUTH_KEY) ?? "")
  );

  return <AuthContext value={[user, setUser]}>{children}</AuthContext>;
}

export function AuthRole({
  children,
  roles,
}: {
  roles: Roles[];
  children: React.ReactNode;
}) {
  const [user] = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!user) router.push(`${LoginPath}?redirect=${pathname}`);
  });

  if (!user) return;

  if (!roles.includes(user.role))
    return <h1>You are not authorized to access this page</h1>;

  return children;
}

export function LoginButton() {
  const user = useContext(AuthContext);
  const pathname = usePathname();

  if (pathname === LoginPath || user) return;

  return (
    <RedirectButton href={`${LoginPath}?redirect=${pathname}`}>
      Log in
    </RedirectButton>
  );
}

export function UserPanel() {
  const [user] = useContext(AuthContext);
  const [display, setDisplay] = useState(false);

  if (!user) return;

  return (
    <div className="relative text-center">
      <Button
        className="w-28 border-2 py-1"
        onClick={() => setDisplay(!display)}
      >
        {user.username}
      </Button>
      <ColumnWrapper
        className={`absolute transition-nav h-fit overflow-y-hidden ${
          display ? "max-h-20" : "max-h-0"
        }  z-5 top-9 w-28 rounded bg-blue-400`}
      >
        <LogoutButton className="px-2 py-1 border-0 rounded hover:bg-line dark:hover:text-background" />
      </ColumnWrapper>
    </div>
  );
}

function LogoutButton({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [_, setUser] = useContext(AuthContext);
  const router = useRouter();

  props.type = "button";
  props.onClick = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", undefined, {
        withCredentials: true,
      });
      setUser(null);
      router.push(LoginPath);
    } catch (err) {
      const error = err as AxiosError;
      console.error(err);
      alert(error.response?.data);
    }
  }, []);

  return <button {...props}>Log Out</button>;
}

type LoginError = {
  message?: string;
  username?: string;
  password?: string;
};

export function LoginForm({ pathname }: { pathname?: string }) {
  const router = useRouter();
  const [_, setUser] = useContext(AuthContext);
  const [error, setError] = useState<LoginError>({});
  const [state, formAction, pending] = useActionState(
    async (_: any, form: FormData) => {
      const body = Object.fromEntries(form.entries());

      try {
        const response = await axios.post("/api/auth/login", body, {
          withCredentials: true,
        });
        setUser(response.data.refresh_token);
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
