"use client";

import {
  useCrawlerScrapers,
  useCrawlerSessions,
  useCrawlerControl,
} from "../hooks/useCrawlerControl";
import ScraperCard from "./ScraperCard";

export default function ScrapersGrid() {
  const { data: scrapers = [], isLoading: loadingScrapers } = useCrawlerScrapers();
  const { pollingActive, actionInProgress, handleStartCrawl, handleStopCrawl } =
    useCrawlerControl();
  const { data: sessions = [] } = useCrawlerSessions(pollingActive);

  return (
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
            const runningSession = sessions.find((s) => s.name === scraper.name);
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
  );
}
