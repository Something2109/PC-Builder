"use client";

import { useState } from "react";

import { CrawlerSession, CrawlState, SerializedError } from "@pc-builder/shared/crawler";

interface SessionMonitorProps {
  sessions: CrawlerSession[];
}

export default function SessionMonitor({ sessions }: SessionMonitorProps) {
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});

  const toggleErrors = (name: string) => {
    setExpandedErrors((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getStatusBadge = (state: CrawlState) => {
    switch (state) {
      case CrawlState.CRAWLING:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Crawling
          </span>
        );
      case CrawlState.COMPLETED:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case CrawlState.STOPPED:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Stopped
          </span>
        );
      case CrawlState.FAILED:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Idle
          </span>
        );
    }
  };

  const formatDate = (dateInput: Date | string) => {
    try {
      return new Date(dateInput).toLocaleString();
    } catch {
      return String(dateInput);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
        <svg
          className="w-10 h-10 text-slate-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="text-sm">No crawling sessions recorded. Start a scraper to begin.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {sessions.map((session) => {
        const { name, state, progress, errors, startTime, products } = session;
        const totalProcessed = progress.success + progress.failed;
        const totalExpected = progress.init || 1;
        const percent = Math.min(Math.round((totalProcessed / totalExpected) * 100), 100);
        const hasErrors = errors.length > 0;
        const showErrors = !!expandedErrors[name];

        return (
          <div
            key={name}
            className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all flex flex-col gap-4"
          >
            {/* Header: Name, Products and State */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-md font-bold text-white uppercase tracking-wider">{name}</h3>
                  {getStatusBadge(state)}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <span>Targets:</span>
                  {products.map((p) => (
                    <span
                      key={p}
                      className="px-1.5 py-0.2 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]"
                    >
                      {p}
                    </span>
                  ))}
                  <span className="text-slate-600 mx-1">•</span>
                  <span>Started: {formatDate(startTime)}</span>
                </div>
              </div>

              {/* Progress Count Header */}
              <div className="text-right">
                <span className="text-sm font-bold text-white">
                  {progress.success} <span className="text-slate-500 font-normal">success</span>
                </span>
                {progress.failed > 0 && (
                  <span className="text-sm font-bold text-rose-400 ml-2">
                    {progress.failed} <span className="text-slate-500 font-normal">failed</span>
                  </span>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-500 ${
                    state === CrawlState.CRAWLING
                      ? "bg-blue-500"
                      : state === CrawlState.FAILED
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Progress: {percent}%</span>
                <span>
                  {totalProcessed} / {progress.init} units processed
                </span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
              <div className="flex flex-col text-center">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Init
                </span>
                <span className="text-sm font-semibold text-slate-300">{progress.init}</span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Fetch
                </span>
                <span className="text-sm font-semibold text-slate-300">{progress.fetch}</span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Extract
                </span>
                <span className="text-sm font-semibold text-slate-300">{progress.extract}</span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Parse
                </span>
                <span className="text-sm font-semibold text-slate-300">{progress.parse}</span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Success
                </span>
                <span className="text-sm font-semibold text-emerald-400">{progress.success}</span>
              </div>
              <div className="flex flex-col text-center border-l border-slate-800/60">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  Failed
                </span>
                <span className="text-sm font-semibold text-rose-400">{progress.failed}</span>
              </div>
            </div>

            {/* Error Tracker Section */}
            {hasErrors && (
              <div className="mt-1 border-t border-slate-800/40 pt-3">
                <button
                  type="button"
                  onClick={() => toggleErrors(name)}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer focus:outline-none"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showErrors ? "rotate-95" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>
                    Show {errors.length} Execution Error
                    {errors.length > 1 ? "s" : ""}
                  </span>
                </button>

                {showErrors && (
                  <div className="flex flex-col gap-2 mt-2 bg-rose-950/20 border border-rose-900/50 rounded-lg p-3 max-h-60 overflow-y-auto">
                    {errors.map((error: SerializedError, index: number) => (
                      <div
                        key={`${index}-${error.name}`}
                        className="text-xs border-b border-rose-900/20 last:border-0 pb-2 last:pb-0"
                      >
                        <div className="flex items-center gap-2 text-rose-300 font-semibold mb-1">
                          <span className="px-1.5 py-0.2 bg-rose-900/40 rounded text-[10px]">
                            {error.name}
                          </span>
                          <span>{error.message}</span>
                        </div>
                        {error.stack && (
                          <pre className="p-2 bg-slate-950/60 rounded text-[10px] font-mono text-rose-400 overflow-x-auto max-h-24 select-all">
                            {error.stack}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
