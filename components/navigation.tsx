"use client";

import Link from "next/link";
import React from "react";

const transitionClass = "transition-transform ease-in-out duration-500 delay-0";
const smallScreen =
  "sticky z-50 mx-auto top-16 md:top-20 flex flex-row flex-wrap overflow-y-auto bg-navigation h-fit";
const mediumScreen = "md:justify-evenly md:max-h-fit";

export default function NavigationBar({ toggle }: { toggle: boolean }) {
  return (
    <nav
      className={`${transitionClass} ${smallScreen} ${mediumScreen} ${
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
