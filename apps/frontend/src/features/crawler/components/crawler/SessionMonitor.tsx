"use client";

import {
  CrawlerSession,
  CrawlState,
  SerializedError,
  CrawlProcessLog,
} from "@pc-builder/shared/crawler";
import { useState } from "react";

import { useCrawlerTraces } from "../../hooks/useCrawlerControl";

interface SessionMonitorProps {
  sessions: CrawlerSession[];
}

export default function SessionMonitor({ sessions }: SessionMonitorProps) {
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({});
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleErrors = (name: string) => {
    setExpandedErrors((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleLogs = (name: string) => {
    setExpandedLogs((prev) => ({ ...prev, [name]: !prev[name] }));
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
        const { sessionId, name, state, progress, errors, startTime, products } = session;

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

            {/* Show logs and errors buttons */}
            <div className="mt-1 border-t border-slate-800/40 pt-3 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => toggleLogs(name)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer focus:outline-none"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${expandedLogs[name] ? "rotate-90" : ""}`}
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
                <span>{expandedLogs[name] ? "Hide" : "Show"} Live Activity Logs</span>
              </button>

              {hasErrors && (
                <button
                  type="button"
                  onClick={() => toggleErrors(name)}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer focus:outline-none"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showErrors ? "rotate-90" : ""}`}
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
              )}
            </div>

            {expandedLogs[name] && sessionId && (
              <SessionTraces sessionId={sessionId} pollingActive={state === CrawlState.CRAWLING} />
            )}

            {/* Error Tracker Section */}
            {hasErrors && showErrors && (
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
        );
      })}
    </div>
  );
}

interface TraceWithId extends CrawlProcessLog {
  _id: string;
}

function SessionTraces({
  sessionId,
  pollingActive,
}: {
  sessionId: string;
  pollingActive: boolean;
}) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const { data, isLoading } = useCrawlerTraces(sessionId, undefined, 1, 50, pollingActive);

  if (isLoading) {
    return <div className="text-xs text-slate-500 py-2">Loading logs...</div>;
  }

  const traces = (data?.list || []) as unknown as TraceWithId[];

  if (traces.length === 0) {
    return (
      <div className="text-xs text-slate-555 py-2 text-slate-500 font-mono">
        No activity logs recorded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-3 border-t border-slate-800/40 pt-3">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        Crawl Activity Logs
      </h4>
      <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1">
        {traces.map((trace) => {
          const isExpanded = expandedTraceId === trace._id;
          const isSuccess = trace.status === "SUCCESS";
          return (
            <div
              key={trace._id}
              className={`text-xs border rounded-lg p-2.5 transition-all ${
                isSuccess
                  ? "bg-slate-950/20 border-slate-800/65"
                  : "bg-rose-950/10 border-rose-900/30"
              }`}
            >
              {/* Row header */}
              <div
                className="flex items-center justify-between gap-2 cursor-pointer"
                onClick={() => setExpandedTraceId(isExpanded ? null : trace._id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      isSuccess ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className="font-mono text-[10px] bg-slate-800 border border-slate-700 px-1 py-0.2 rounded text-slate-300 uppercase shrink-0">
                    {trace.product}
                  </span>
                  <span className="text-slate-300 font-mono truncate text-[11px]" title={trace.url}>
                    {trace.url}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {trace.createdAt ? new Date(trace.createdAt).toLocaleTimeString() : ""}
                  </span>

                  <svg
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
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
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 border-t border-slate-800/40 pt-2 flex flex-col gap-3">
                  {/* Stages */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-950/40 border border-slate-800 p-2 rounded">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">1. Fetch</div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                        Status: {trace.fetchStage?.statusCode || 200}
                      </div>
                      {trace.fetchStage?.responseTimeMs > 0 && (
                        <div className="text-[10px] text-slate-500">
                          {trace.fetchStage.responseTimeMs}ms
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800 p-2 rounded">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        2. Extract
                      </div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                        Items: {trace.extractStage?.itemsCount ?? 0}
                      </div>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800 p-2 rounded">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">3. Parse</div>
                      <div className="text-[11px] font-semibold text-slate-300 mt-0.5">
                        Parsed: {trace.parseStage?.success ? "✓ Yes" : "✗ No"}
                      </div>
                    </div>
                  </div>

                  {/* Parse Result payload */}
                  {isSuccess && trace.parseStage?.parsedResult && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">
                        Parsed Result Data
                      </span>
                      <pre className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto select-all max-h-36">
                        {JSON.stringify(trace.parseStage.parsedResult, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Errors / Failures details */}
                  {!isSuccess && trace.errorDetails && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-rose-400 font-bold uppercase">
                        Error (Stage: {trace.errorDetails.stage})
                      </span>
                      <div className="p-2.5 bg-rose-950/20 border border-rose-900/50 rounded text-rose-300 font-semibold">
                        {trace.errorDetails.message}
                      </div>
                      {trace.errorDetails.stack && (
                        <pre className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-mono text-rose-400 overflow-x-auto max-h-36 select-all">
                          {trace.errorDetails.stack}
                        </pre>
                      )}
                      {trace.fetchStage?.rawPayload && (
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">
                            Raw Response Payload (HTML/Source)
                          </span>
                          <pre className="p-2 bg-slate-950/80 rounded border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48 select-all">
                            {trace.fetchStage.rawPayload}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
