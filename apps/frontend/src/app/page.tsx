import Image from "next/image";
import Link from "next/link";
import React from "react";

import { SearchBar } from "@/layout/searchbar";
import { Products } from "@/utils/part";

const categories = [
  { name: "Processors", part: Products.CPU, icon: "cpu", desc: "Intel Core & AMD Ryzen CPUs" },
  { name: "Graphics Cards", part: Products.GRAPHIC_CARD, icon: "graphic_card", desc: "NVIDIA RTX & AMD Radeon GPUs" },
  { name: "Motherboards", part: Products.MAIN, icon: "mainboard", desc: "AM4, AM5, LGA 1700 boards" },
  { name: "Memory (RAM)", part: Products.RAM, icon: "ram", desc: "DDR4 & DDR5 memory kits" },
  { name: "Solid State Drives", part: Products.SSD, icon: "ssd", desc: "High-speed NVMe & SATA SSDs" },
  { name: "Power Supplies", part: Products.PSU, icon: "psu", desc: "80+ Gold, Platinum power units" },
  { name: "PC Cases", part: Products.CASE, icon: "case", desc: "ATX, Micro-ATX, and ITX cases" },
  { name: "Coolers", part: Products.COOLER, icon: "cooler", desc: "Air coolers & liquid AIOs" },
];

export default function Page() {
  return (
    <div className="w-full space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accentIndigo/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accentCyan/30 bg-accentCyan/5 text-xs text-accentCyan font-semibold tracking-wide uppercase">
          <span className="size-1.5 rounded-full bg-accentCyan animate-pulse" />
          Real-time Compatibility Engine Active
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none">
          Build Your Ultimate{" "}
          <span className="bg-gradient-to-r from-accentIndigo via-purple-500 to-accentCyan bg-clip-text text-transparent">
            Dream PC
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text/60 max-w-2xl mx-auto leading-relaxed">
          Create, customize, and check compatibility for your next custom computer build with our intelligent planning system.
        </p>

        {/* Floating Glassmorphic Search Bar */}
        <div className="w-full max-w-2xl mx-auto pt-4">
          <SearchBar />
        </div>
      </section>

      {/* Main Call to Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        <Link
          href="/build"
          className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-accentIndigo hover:shadow-xl hover:shadow-accentIndigo/5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentIndigo/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
          <h3 className="text-xl font-bold mb-2 group-hover:text-accentIndigo transition-colors">
            Start A New Build &rarr;
          </h3>
          <p className="text-sm text-text/60 leading-relaxed">
            Jump into our step-by-step system builder. Select CPU, GPU, motherboard, and see compatibility flags.
          </p>
        </Link>

        <Link
          href="/part"
          className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-accentCyan hover:shadow-xl hover:shadow-accentCyan/5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentCyan/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
          <h3 className="text-xl font-bold mb-2 group-hover:text-accentCyan transition-colors">
            Explore Hardware Directory &rarr;
          </h3>
          <p className="text-sm text-text/60 leading-relaxed">
            Browse through hundreds of individual parts with deep spec listings, price analysis, and details.
          </p>
        </Link>

        <Link
          href="/guide"
          className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-550/5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">
            Builder Guides &rarr;
          </h3>
          <p className="text-sm text-text/60 leading-relaxed">
            New to PC building? Read expert guides, curated configuration recommendations, and building tutorials.
          </p>
        </Link>
      </section>

      {/* Hardware Categories Grid */}
      <section className="space-y-6 max-w-6xl mx-auto px-4">
        <div className="flex flex-row justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-sm text-text/60 mt-1">Select a component class to inspect details and specifications</p>
          </div>
          <Link
            href="/part"
            className="text-sm text-accentIndigo hover:text-accentCyan font-semibold transition-colors"
          >
            All Parts &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.part}
              href={`/part/${cat.part}`}
              className="group flex flex-col p-5 rounded-2xl border border-border bg-card hover:border-accentCyan transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-xl bg-accentIndigo/10 flex items-center justify-center group-hover:bg-accentCyan/10 transition-colors">
                  <Image
                    src={`/images/icons/${cat.icon}.png`}
                    alt={cat.name}
                    width={24}
                    height={24}
                    className="dark:invert group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-text group-hover:text-accentCyan transition-colors">
                  {cat.name}
                </h4>
              </div>
              <p className="text-xs text-text/50 leading-normal mt-auto">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
