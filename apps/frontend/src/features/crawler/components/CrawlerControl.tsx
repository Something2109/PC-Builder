"use client";

import { ColumnWrapper, ResponsiveWrapper } from "@/ui/FlexWrapper";

import { useCrawlerControl } from "../hooks/useCrawlerControl";
import CrawlerHeader from "./CrawlerHeader";
import ErrorBanner from "./ErrorBanner";
import InteractiveTools from "./InteractiveTools";
import ScraperCard from "./ScraperCard";
import SessionMonitor from "./SessionMonitor";

export default function CrawlerControl() {
  const {
    scrapers,
    sessions,
    loadingScrapers,
    error,
    setError,
    pollingActive,
    setPollingActive,
    actionInProgress,
    handleStartCrawl,
    handleStopCrawl,
  } = useCrawlerControl();

  return (
    <ColumnWrapper className="w-full gap-6 p-4 md:p-6 text-line bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      <CrawlerHeader
        pollingActive={pollingActive}
        onTogglePolling={() => setPollingActive(!pollingActive)}
      />

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {/* Main Responsive Grid Layout */}
      <ResponsiveWrapper className="w-full gap-6 items-start">
        {/* Left Column: Scrapers Grid & Session Monitor */}
        <ColumnWrapper className="basis-2/3 gap-6 w-full">
          {/* Section 1: Scrapers Grid */}
          <div className="bg-slate-800/25 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              Available Scrapers
            </h2>

            {loadingScrapers ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading scraper configurations...</span>
              </div>
            ) : scrapers.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No scrapers configured in the registry.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scrapers.map((scraper) => {
                  // Find running session for this scraper to determine action states
                  const runningSession = sessions.find(
                    (s) => s.name === scraper.name
                  );
                  return (
                    <ScraperCard
                      key={scraper.name}
                      scraper={scraper}
                      session={runningSession}
                      actionInProgress={actionInProgress}
                      onStart={handleStartCrawl}
                      onStop={handleStopCrawl}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Session Monitor */}
          <div className="bg-slate-800/25 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm0 0h5a2 2 0 002-2v-3a2 2 0 00-2-2h-5m5 13h5a2 2 0 002-2V5a2 2 0 00-2-2h-5a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Crawl Sessions Monitor
            </h2>
            <SessionMonitor sessions={sessions} />
          </div>
        </ColumnWrapper>

        {/* Right Column: Interactive Debug / Testing Tools */}
        <ColumnWrapper className="basis-1/3 gap-6 w-full">
          <div className="bg-slate-800/25 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              On-Demand Tools
            </h2>
            <InteractiveTools scrapers={scrapers} />
          </div>
        </ColumnWrapper>
      </ResponsiveWrapper>
    </ColumnWrapper>
  );
}
