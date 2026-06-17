"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth, useLogoutAction } from "@/features/auth";
import { Button, RedirectButton } from "@/ui/Button";
import { ColumnWrapper } from "@/ui/FlexWrapper";

const LoginPath = "/auth/login";

export function UserPanel() {
  const user = useAuth();
  const [isLogginOut, logout] = useLogoutAction();
  const [display, setDisplay] = useState(false);
  const pathname = usePathname();

  if (pathname === LoginPath) return;

  if (!user)
    return <RedirectButton href={`${LoginPath}?redirect=${pathname}`}>Log in</RedirectButton>;

  return (
    <div className="relative text-center">
      <Button className="w-28 border-2 py-1" onClick={() => setDisplay(!display)}>
        {user.username}
      </Button>
      <ColumnWrapper
        className={`absolute transition-nav h-fit overflow-y-hidden ${
          display ? "max-h-20" : "max-h-0"
        }  z-5 top-9 w-28 rounded bg-blue-400`}
      >
        <Button
          type="button"
          onClick={logout}
          className="px-2 py-1 border-0 rounded hover:bg-line dark:hover:text-background"
          disabled={isLogginOut}
        >
          Log Out
        </Button>
      </ColumnWrapper>
    </div>
  );
}
