"use client";
import Link from "next/link";

export default function Header({ toggle }: { toggle: Function }) {
  return (
    <header className="sticky top-0 z-50 flex flex-row h-16 place-items-center justify-between bg-header md:h-20">
      <Link
        className="font-bold text-xl m-10 md:text-2xl text-yellow-400"
        href={"/"}
      >
        PC Builder
      </Link>
      <button type="button" className="m-10 md:hidden" onClick={() => toggle()}>
        Menu
      </button>
    </header>
  );
}
