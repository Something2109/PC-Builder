"use client";

import { Roles } from "@pc-builder/shared/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { UserPanel, Guard } from "@/features/auth";
import { RowWrapper } from "@/ui/FlexWrapper";

import { DarkModeButton } from "./body";

export default function Header() {
  const [navbar, setNavbar] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { title: "Introduction", link: "/introduction" },
    { title: "Guide", link: "/guide" },
    { title: "Parts", link: "/part" },
    { title: "Build PC", link: "/build" },
    { title: "Mapper Test", link: "/mapper" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glassmorphism transition-all duration-300">
        <div className="container mx-auto px-6 h-16 md:h-20 flex flex-row items-center justify-between">
          <Link
            className="font-bold text-xl md:text-2xl tracking-wider bg-linear-to-r from-accent-indigo via-purple-500 to-accent-cyan bg-clip-text text-transparent hover:opacity-85 transition-opacity"
            href={"/"}
          >
            PC BUILDER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-row items-center gap-1">
            {navItems.map((item) => (
              <NavigationButton
                key={item.link}
                link={item.link}
                title={item.title}
                active={pathname.startsWith(item.link)}
              />
            ))}
            <Guard roles={Roles.ADMIN}>
              <NavigationButton
                link="/crawler"
                title="Crawler"
                active={pathname.startsWith("/crawler")}
              />
              <NavigationButton
                link="/aliases"
                title="Aliases"
                active={pathname.startsWith("/aliases")}
              />
              <NavigationButton
                link="/mapper"
                title="Mapper Test"
                active={pathname.startsWith("/mapper")}
              />
            </Guard>
          </nav>

          <RowWrapper className="gap-3 items-center">
            <DarkModeButton />
            <div className="hidden sm:block">
              <UserPanel />
            </div>
            <button
              type="button"
              className="md:hidden px-3 py-1.5 rounded-xl border border-border hover:bg-line transition-props text-sm font-semibold"
              onClick={() => setNavbar(!navbar)}
            >
              Menu
            </button>
          </RowWrapper>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 z-40 glassmorphism border-b border-border shadow-xl transition-all duration-300 overflow-hidden ${
          navbar ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <MobileNavigationButton
              key={item.link}
              link={item.link}
              title={item.title}
              active={pathname.startsWith(item.link)}
              onClick={() => setNavbar(false)}
            />
          ))}
          <Guard roles={Roles.ADMIN}>
            <MobileNavigationButton
              link="/crawler"
              title="Crawler"
              active={pathname.startsWith("/crawler")}
              onClick={() => setNavbar(false)}
            />
            <MobileNavigationButton
              link="/aliases"
              title="Aliases"
              active={pathname.startsWith("/aliases")}
              onClick={() => setNavbar(false)}
            />
            <MobileNavigationButton
              link="/mapper"
              title="Mapper Test"
              active={pathname.startsWith("/mapper")}
              onClick={() => setNavbar(false)}
            />
          </Guard>
          <div className="sm:hidden pt-2 border-t border-border mt-2">
            <UserPanel />
          </div>
        </div>
      </div>
    </>
  );
}

function NavigationButton({
  title,
  link,
  active,
}: Readonly<{ title: string; link: string; active: boolean }>) {
  return (
    <Link
      href={link}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:text-accent-cyan ${
        active
          ? "bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20"
          : "text-text/80 hover:bg-line/20"
      }`}
    >
      {title}
    </Link>
  );
}

function MobileNavigationButton({
  title,
  link,
  active,
  onClick,
}: Readonly<{
  title: string;
  link: string;
  active: boolean;
  onClick: () => void;
}>) {
  return (
    <Link
      href={link}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 block ${
        active ? "bg-accent-indigo/10 text-accent-indigo" : "text-text/80 hover:bg-line/20"
      }`}
    >
      {title}
    </Link>
  );
}
