"use client";

import { JwtPayload as UserJwtPayload, Roles } from "@/utils/user";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useActionState,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

const AUTH_KEY = "REFRESH-TOKEN";
const LoginPath = "/auth/login";
const AuthContext = createContext<
  [UserJwtPayload | null, Dispatch<SetStateAction<UserJwtPayload | null>>]
>([null, () => {}]);

export function useAuth() {
  const [user, _] = useContext(AuthContext);
  return user;
}

export function AuthWrapper({
  user,
  children,
}: Readonly<{ user: UserJwtPayload | null; children: React.ReactNode }>) {
  const state = useState(user);

  return <AuthContext value={state}>{children}</AuthContext>;
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
