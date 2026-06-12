"use client";

import React from "react";

import { Roles } from "@/utils/user";

import { useAuth } from "../hooks/useAuth";

export interface GuardProps {
  roles: Roles | Roles[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Guard({ roles, fallback = null, children }: GuardProps) {
  const user = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
