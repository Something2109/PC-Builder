"use client";
import Link from "next/link";
import { RowWrapper } from "./utils/FlexWrapper";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DarkModeButton } from "./body";
import { RedirectButton } from "./utils/Button";

export default function Header() {
  const [navbar, setNavbar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setNavbar(false); // Close the navigation panel
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 flex flex-row h-16 place-items-center justify-between bg-header md:h-20">
        <Link
          className="font-bold text-xl m-10 md:text-2xl text-yellow-400"
          href={"/"}
        >
          PC Builder
        </Link>
        <RowWrapper className="m-10 items-center">
          <DarkModeButton />
          <button
            type="button"
            className="md:hidden"
            onClick={() => setNavbar(!navbar)}
          >
            Menu
          </button>
        </RowWrapper>
      </header>
      <NavigationBar toggle={navbar} />
    </>
  );
}

const smallScreen =
  "sticky z-50 mx-auto top-16 md:top-20 flex flex-row flex-wrap overflow-y-hidden bg-navigation h-fit";
const mediumScreen = "md:justify-evenly md:max-h-fit";

function NavigationBar({ toggle }: { toggle: boolean }) {
  return (
    <nav
      className={`transition-nav ${smallScreen} ${mediumScreen} ${
        toggle ? "max-h-9" : "max-h-0"
      }`}
    >
      <NavigationButton link="/introduction" title="Introduction" />
      <NavigationButton link="/guide" title="Guide" />
      <NavigationButton link="/part" title="Part" />
      <NavigationButton link="/build" title="Build" />
    </nav>
  );
}

function NavigationButton({ title, link }: { title: string; link: string }) {
  return (
    <Link
      href={link}
      className={
        "m-0.5 px-4 py-1 font-medium md:text-2xl hover:m-0 hover:bg-header hover:border-blue-700 hover:border-2"
      }
    >
      {title}
    </Link>
  );
}
