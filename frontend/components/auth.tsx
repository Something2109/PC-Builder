"use client";

import { JwtPayload as UserJwtPayload, Roles } from "@/utils/user";
import {
  ActionDispatch,
  createContext,
  useActionState,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import { JwtPayload } from "jsonwebtoken";
import { createDecoder } from "fast-jwt";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

const decode = createDecoder();

type SaveTokens = {
  refresh_token?: string | null;
  csrf_token?: string | null;
};

const AUTH_KEY = "REFRESH-TOKEN";
const CSRF_KEY = "CSRF-TOKEN";
const LoginPath = "/auth/login";
const AuthContext = createContext<
  [UserJwtPayload | null, ActionDispatch<[SaveTokens]>]
>([null, () => {}]);

function decodeToken(token: string | null) {
  let payload: JwtPayload | null = null;
  try {
    payload = decode(token ?? "");
  } catch (err) {
    console.error(err);
  }

  if (!payload) return null;

  if (payload.exp || payload.iat) {
    const current = Date.now() / 1000;

    if (payload.exp && payload.exp < current) return null;

    if (payload.nbf && payload.nbf > current) return null;
  }

  return payload.sub as unknown as UserJwtPayload;
}

export function useAuth() {
  const [user, _] = useContext(AuthContext);
  return user;
}

export function AuthWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const reducer = useReducer(
    (_: UserJwtPayload | null, { refresh_token, csrf_token }: SaveTokens) => {
      const userInfo = decodeToken(refresh_token ?? null);

      if (refresh_token && userInfo) {
        localStorage.setItem(AUTH_KEY, refresh_token);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }

      if (csrf_token) {
        localStorage.setItem(CSRF_KEY, csrf_token);

        axios.defaults.headers.common["x-csrf-token"] = csrf_token;
      }

      return userInfo;
    },
    null
  );

  useLayoutEffect(
    () =>
      reducer[1]({
        refresh_token: localStorage.getItem(AUTH_KEY),
        csrf_token: localStorage.getItem(CSRF_KEY),
      }),
    []
  );

  return <AuthContext value={reducer}>{children}</AuthContext>;
}

export function AuthRole({
  children,
  roles,
}: Readonly<{
  roles: Roles[];
  children: React.ReactNode;
}>) {
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

type LoginError = {
  message?: string;
  username?: string;
  password?: string;
};

export function useLoginAction(pathname?: string) {
  const router = useRouter();
  const [_, setUser] = useContext(AuthContext);
  const [error, setError] = useState<LoginError>({});
  const [state, formAction, pending] = useActionState(
    async (_: Record<string, string>, form: FormData) => {
      const body = Object.fromEntries(form.entries());

      try {
        const response = await axios.post("/api/auth/login", body, {
          withCredentials: true,
        });
        setUser(response.data);
        router.push(pathname ?? "/");
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);

        const LoginError = error.response
          ? (error.response.data as LoginError)
          : { message: "Cannot connect to server." };
        setError(LoginError);
      }

      return body as Record<string, string>;
    },
    {}
  );

  return [state, formAction, pending, error, setError] as const;
}

export function useRefreshAction(pathname?: string | null) {
  const [pending, startTransition] = useTransition();
  const [_, setUser] = useContext(AuthContext);
  const router = useRouter();
  const redirectPath = pathname ?? "/";

  useEffect(() => {
    startTransition(async () => {
      const token = localStorage.getItem(AUTH_KEY);

      try {
        const response = await axios.post("/api/auth/refresh", undefined, {
          withCredentials: true,
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        setUser(response.data);
        router.replace(redirectPath);
      } catch (err) {
        console.error(err);

        router.replace(`${LoginPath}?redirect=${redirectPath}`);
      }
    });
  }, []);

  return pending;
}

export function useLogoutAction() {
  const [pending, startTransition] = useTransition();
  const [_, setUser] = useContext(AuthContext);
  const router = useRouter();

  const logout = () =>
    startTransition(async () => {
      try {
        const response = await axios.post("/api/auth/logout", undefined, {
          withCredentials: true,
        });
        setUser(response.data);
        router.push(LoginPath);
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);
        alert(error.response?.data ?? "Cannot connect to server.");
      }
    });

  return [pending, logout] as const;
}
