"use client";

import Image from "next/image";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const DarkChanger = createContext<Dispatch<SetStateAction<boolean>> | null>(
  null
);

export function ThemeBody({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useLayoutEffect(() => {
    setDark(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  return (
    <body
      className={`${
        dark ? "dark" : ""
      } transition-props dark:text-line bg-w dark:bg-background overflow-y-scroll`}
    >
      <DarkChanger value={setDark}>{children}</DarkChanger>
    </body>
  );
}

export function DarkModeButton() {
  const setDark = useContext(DarkChanger);

  return (
    <button
      type="button"
      title="dark-mode"
      className=" h-1/2"
      onClick={() => setDark!((val) => !val)}
    >
      <picture className="aspect-square size-7 flex flex-col">
        <Image
          src="/images/icons/night-mode.png"
          width={40}
          height={40}
          alt="dark"
          className="dark:w-0 transition-all transition-props"
        />
        <Image
          src="/images/icons/light-mode.png"
          width={40}
          height={40}
          alt="light"
          className="w-0 dark:w-12 transition-all transition-props"
        />
      </picture>
    </button>
  );
}
