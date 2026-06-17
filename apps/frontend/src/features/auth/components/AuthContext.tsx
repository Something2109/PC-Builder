"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, createContext, useContext, useLayoutEffect } from "react";

import axiosInstance from "@/lib/axios";
import { JwtPayload as UserJwtPayload, Roles } from "@/utils/user";

const LoginPath = "/auth/login";

interface AuthContextType {
  user: UserJwtPayload | null;
  setUser: Dispatch<SetStateAction<UserJwtPayload | null>>;
  refresh: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthWrapper({
  user: initialUser,
  children,
}: Readonly<{ user: UserJwtPayload | null; children: React.ReactNode }>) {
  const queryClient = useQueryClient();

  const { data: user = initialUser, isLoading: loading } = useQuery<UserJwtPayload | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
      } catch {
        return null;
      }
    },
    initialData: initialUser ?? undefined,
    enabled: !initialUser,
  });

  const setUser: Dispatch<SetStateAction<UserJwtPayload | null>> = (value) => {
    queryClient.setQueryData<UserJwtPayload | null>(["authUser"], (oldUser) => {
      return typeof value === "function"
        ? (value as (prev: UserJwtPayload | null) => UserJwtPayload | null)(oldUser ?? null)
        : value;
    });
  };

  const refresh = async () => {
    await queryClient.refetchQueries({ queryKey: ["authUser"] });
  };

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

  if (!roles.includes(user.role)) return <h1>You are not authorized to access this page</h1>;

  return children;
}
