"use client";

import Link from "next/link";
import React from "react";

import MapperInputPanel from "./input/MapperInputPanel";
import MapperResultPanel from "./display/MapperResultPanel";
import { useTestMapping } from "../hooks/useTestMapping";

export default function MapperTest() {
  const { testMappingAsync, loading, result, error, lastMappedJson } = useTestMapping();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 text-slate-200 bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Specs Mapper Tester
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Validate and test raw key-value scraped specs mapping into structured product schemas
            on-demand.
          </p>
        </div>
        <Link
          href="/crawler"
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-600 transition-all shadow-md cursor-pointer"
        >
          &larr; Back to Crawler
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Panel (cols 5) */}
        <MapperInputPanel onSubmit={testMappingAsync} loading={loading} error={error} />

        {/* Right: Output Panel (cols 7) */}
        <MapperResultPanel loading={loading} result={result} lastMappedJson={lastMappedJson} />
      </div>
    </div>
  );
}
