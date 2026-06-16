"use client";

interface CrawlerHeaderProps {
  pollingActive: boolean;
  onTogglePolling: () => void;
}

export default function CrawlerHeader({
  pollingActive,
  onTogglePolling,
}: CrawlerHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Crawler Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor, control, and test scraper microservices in real-time.
        </p>
      </div>

      {/* Polling Indicator Control */}
      <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700/50 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              pollingActive ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
            }`}
          />
          <span className="text-slate-300">
            {pollingActive ? "Live Polling" : "Polling Paused"}
          </span>
        </div>
        <button
          type="button"
          onClick={onTogglePolling}
          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer"
        >
          {pollingActive ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
