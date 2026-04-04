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
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

const LoginPath = "/auth/login";

interface AuthContextType {
  user: UserJwtPayload | null;
  setUser: Dispatch<SetStateAction<UserJwtPayload | null>>;
  refresh: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthWrapper");
  return context.user;
}

export function AuthWrapper({
  user: initialUser,
  children,
}: Readonly<{ user: UserJwtPayload | null; children: React.ReactNode }>) {
  const [user, setUser] = useState<UserJwtPayload | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refresh = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      refresh();
    }
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, refresh, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthRole({
  children,
  roles,
}: Readonly<{
  roles: Roles[];
  children: React.ReactNode;
}>) {
  const context = useContext(AuthContext);
  const user = context?.user;
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!user && !context?.loading) router.push(`${LoginPath}?redirect=${pathname}`);
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
  const context = useContext(AuthContext);
  const [error, setError] = useState<LoginError>({});
  const [state, formAction, pending] = useActionState(
    async (_: Record<string, string>, form: FormData) => {
      const body = Object.fromEntries(form.entries());

      try {
        const response = await axiosInstance.post("/auth/login", body);
        context?.setUser(response.data);
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
  const context = useContext(AuthContext);
  const router = useRouter();
  const redirectPath = pathname ?? "/";

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/auth/refresh");
        context?.setUser(response.data);
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
  const context = useContext(AuthContext);
  const router = useRouter();

  const logout = () =>
    startTransition(async () => {
      try {
        await axiosInstance.post("/auth/logout");
        context?.setUser(null);
        router.push(LoginPath);
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);
        alert(typeof error.response?.data === 'string' ? error.response.data : "Cannot connect to server.");
      }
    });

  return [pending, logout] as const;
}
