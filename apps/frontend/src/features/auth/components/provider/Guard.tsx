"use client";

import { Roles } from "@pc-builder/shared/user";
import React from "react";

import { useAuth } from "../../hooks/useAuth";

export interface GuardProps {
  roles?: Roles | Roles[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Guard({ roles, fallback = null, children }: GuardProps) {
  const user = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  if (roles !== undefined) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
