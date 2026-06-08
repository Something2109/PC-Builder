"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import axiosInstance from "@/utils/axios";
import { JwtPayload as UserJwtPayload, Roles } from "@/utils/user";

const LoginPath = "/auth/login";

interface AuthContextType {
  user: UserJwtPayload | null;
  setUser: Dispatch<SetStateAction<UserJwtPayload | null>>;
  refresh: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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
    } catch {
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
    if (!user && !context?.loading)
      router.push(`${LoginPath}?redirect=${pathname}`);
  });

  if (!user) return;

  if (!roles.includes(user.role))
    return <h1>You are not authorized to access this page</h1>;

  return children;
}
