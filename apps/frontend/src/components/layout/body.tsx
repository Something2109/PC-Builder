"use client";

import Image from "next/image";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

const DarkChanger = createContext<Dispatch<SetStateAction<boolean>> | null>(null);

export function ThemeBody({ children }: Readonly<{ children: React.ReactNode }>) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        queueMicrotask(() => setDark(true));
      }
    }
  }, []);

  return (
    <body
      data-overlay-root="true"
      className={`${dark ? "dark" : ""} min-h-screen flex flex-col overflow-y-scroll`}
    >
      <DarkChanger value={setDark}>{children}</DarkChanger>
      <div id="dropdown-root" />
      <div id="modal-root" />
    </body>
  );
}

export function DarkModeButton() {
  const setDark = useContext(DarkChanger);

  return (
    <button
      type="button"
      title="Toggle dark mode"
      className="relative aspect-square size-10 rounded-xl flex items-center justify-center border border-border bg-card text-text hover:border-accent-indigo transition-all duration-300 hover:shadow-lg shadow-sm"
      onClick={() => setDark!((val) => !val)}
    >
      <picture className="size-6 relative flex items-center justify-center">
        {/* Sun Icon (shown in dark mode, switches to light) */}
        <Image
          src="/images/icons/light-mode.png"
          width={24}
          height={24}
          alt="light"
          className="absolute transition-all duration-500 ease-out transform dark:scale-100 dark:opacity-100 scale-0 opacity-0 rotate-90 dark:rotate-0"
        />
        {/* Moon Icon (shown in light mode, switches to dark) */}
        <Image
          src="/images/icons/night-mode.png"
          width={24}
          height={24}
          alt="dark"
          className="absolute transition-all duration-500 ease-out transform dark:scale-0 dark:opacity-0 scale-100 opacity-100 dark:-rotate-90 rotate-0"
        />
      </picture>
    </button>
  );
}
