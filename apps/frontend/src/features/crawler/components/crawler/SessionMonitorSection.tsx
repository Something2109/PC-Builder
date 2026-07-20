"use client";

import { useCrawlerSessions, useCrawlerControl } from "../../hooks/useCrawlerControl";
import SessionMonitor from "./SessionMonitor";

export default function SessionMonitorSection() {
  const { pollingActive } = useCrawlerControl();
  const { data: sessions = [] } = useCrawlerSessions(pollingActive);

  return (
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
  );
}
