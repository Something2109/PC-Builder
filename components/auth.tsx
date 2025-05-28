"use client";

import { User } from "@/utils/interface/user/User";
import { Roles } from "@/utils/Enum";
import {
  ActionDispatch,
  createContext,
  useActionState,
  useContext,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import { JwtPayload } from "jsonwebtoken";
import { createDecoder } from "fast-jwt";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

const decode = createDecoder();

const AUTH_KEY = "Authorization";
const LoginPath = "/auth/login";
const AuthContext = createContext<
  [User.JwtPayload | null, ActionDispatch<[string | null]>]
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
    (_: User.JwtPayload | null, curr: string | null) => {
      const userInfo = decodeToken(curr);

      curr && userInfo
        ? localStorage.setItem(AUTH_KEY, curr)
        : localStorage.removeItem(AUTH_KEY);

      return userInfo;
    },
    null
  );

  useLayoutEffect(() => setUser(localStorage?.getItem(AUTH_KEY)), []);

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

  return [state, formAction, pending, error, setError] as const;
}

export function useRefreshToken(pathname?: string | null) {
  const [_, setUser] = useContext(AuthContext);
  const router = useRouter();
  pathname = pathname ?? "/";

  return async () => {
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
  };
}

export function useLogoutAction() {
  const [_, setUser] = useContext(AuthContext);
  const router = useRouter();

  return async () => {
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
  };
}
