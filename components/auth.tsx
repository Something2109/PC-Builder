"use client";

import { User } from "@/utils/interface/user/User";
import { Roles } from "@/utils/Enum";
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
  [User.JwtPayload | null, ActionDispatch<[SaveTokens]>]
>([null, () => {}]);

function decodeToken(token: string | null) {
  let payload: JwtPayload | null = null;
  try {
    payload = decode(token ?? "");
  } catch (err) {}

  if (!payload) return null;

  if (payload.exp || payload.iat) {
    const current = new Date().getTime() / 1000;

    if (payload.exp && payload.exp < current) return null;

    if (payload.nbf && payload.nbf > current) return null;
  }

  return payload.sub as any as User.JwtPayload;
}

export function useAuth() {
  const [user, _] = useContext(AuthContext);
  return user;
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useReducer(
    (_: User.JwtPayload | null, { refresh_token, csrf_token }: SaveTokens) => {
      const userInfo = decodeToken(refresh_token ?? null);

      refresh_token && userInfo
        ? localStorage.setItem(AUTH_KEY, refresh_token)
        : localStorage.removeItem(AUTH_KEY);

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
      setUser({
        refresh_token: localStorage.getItem(AUTH_KEY),
        csrf_token: localStorage.getItem(CSRF_KEY),
      }),
    []
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
    async (_: any, form: FormData) => {
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
  pathname = pathname ?? "/";

  useEffect(() => {
    startTransition(async () => {
      const token = localStorage.getItem(AUTH_KEY);

      try {
        const response = await axios.post("/api/auth/refresh", undefined, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.refresh_token);
        router.replace(pathname);
      } catch (err) {
        router.replace(`${LoginPath}?redirect=${pathname}`);
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
