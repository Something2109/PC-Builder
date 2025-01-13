"use client";
import Link from "next/link";
import { RowWrapper } from "./utils/FlexWrapper";
import Image from "next/image";
import { useContext } from "react";

export default function Header({
  setNavbar,
  setDark,
}: {
  setNavbar: Function;
  setDark: Function;
}) {
  return (
    <header className="sticky top-0 z-50 flex flex-row h-16 place-items-center justify-between bg-header md:h-20">
      <Link
        className="font-bold text-xl m-10 md:text-2xl text-yellow-400"
        href={"/"}
      >
        PC Builder
      </Link>
      <RowWrapper className="m-10">
        <button
          type="button"
          title="dark-mode"
          className=" h-1/2"
          onClick={() => setDark()}
        >
          <picture className="aspect-square size-7 flex flex-col">
            <Image
              src="/images/icons/night-mode.png"
              width={40}
              height={40}
              alt="dark"
              className="dark:w-0 transition-all ease-in-out duration-500 delay-0"
            />
            <Image
              src="/images/icons/light-mode.png"
              width={40}
              height={40}
              alt="light"
              className="w-0 dark:w-12 transition-all ease-in-out duration-500 delay-0"
            />
          </picture>
        </button>
        <button type="button" className="md:hidden" onClick={() => setNavbar()}>
          Menu
        </button>
      </RowWrapper>
    </header>
  );
}
