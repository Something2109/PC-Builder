"use client";

import { useEffect, useState, useRef } from "react";

import axiosInstance from "@/lib/axios";
import { ColumnWrapper, ResponsiveWrapper } from "@/ui/FlexWrapper";
import { ScraperInfo, CrawlerSession } from "@/utils/crawler";

import InteractiveTools from "./InteractiveTools";
import ScraperCard from "./ScraperCard";
import SessionMonitor from "./SessionMonitor";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function CrawlerControl() {
  const [scrapers, setScrapers] = useState<ScraperInfo[]>([]);
  const [sessions, setSessions] = useState<CrawlerSession[]>([]);
  const [loadingScrapers, setLoadingScrapers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Poll intervals reference to clean up
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Poll status of active crawler sessions
  const fetchStatus = async () => {
    try {
      const response = await axiosInstance.get<CrawlerSession[]>("/crawler/status");
      setSessions(response.data);
    } catch (err) {
      console.error("Failed to poll crawl status:", err);
    }
  };

  // Fetch all available scrapers on mount
  useEffect(() => {
    let active = true;
    const fetchScrapers = async () => {
      try {
        setError(null);
        const response = await axiosInstance.get<ScraperInfo[]>("/crawler/scrapers");
        if (active) {
          setScrapers(response.data);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch scrapers:", err);
        if (active) {
          const axiosErr = err as AxiosErrorLike;
          setError(axiosErr.response?.data?.message || "Failed to load scraper configurations.");
        }
      } finally {
        if (active) {
          setLoadingScrapers(false);
        }
      }
    };

    fetchScrapers();
    return () => {
      active = false;
    };
  }, []);

  // Set up polling
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const response = await axiosInstance.get<CrawlerSession[]>("/crawler/status");
        if (active) {
          setSessions(response.data);
        }
      } catch (err) {
        console.error("Failed to poll crawl status:", err);
      }
    };

    if (pollingActive) {
      poll();
      pollTimerRef.current = setInterval(poll, 3000);
    }

    return () => {
      active = false;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [pollingActive]);

  // Start a crawl session
  const handleStartCrawl = async (name: string, selectedProducts: string[]) => {
    try {
      setActionInProgress(`start-${name}`);
      setError(null);
      await axiosInstance.post("/crawler/start", {
        name,
        products: selectedProducts,
      });
      // Immediately refresh status to show the new crawling state
      await fetchStatus();
    } catch (err: unknown) {
      console.error("Failed to start crawl:", err);
      const axiosErr = err as AxiosErrorLike;
      setError(axiosErr.response?.data?.message || `Failed to start crawler for '${name}'.`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Stop a crawl session
  const handleStopCrawl = async (name: string) => {
    try {
      setActionInProgress(`stop-${name}`);
      setError(null);
      await axiosInstance.post("/crawler/stop", { name });
      // Immediately refresh status to show the stopped state
      await fetchStatus();
    } catch (err: unknown) {
      console.error("Failed to stop crawl:", err);
      const axiosErr = err as AxiosErrorLike;
      setError(axiosErr.response?.data?.message || `Failed to stop crawler for '${name}'.`);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <ColumnWrapper className="w-full gap-6 p-4 md:p-6 text-line bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      {/* Dashboard Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Crawler Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor, control, and test scraper microservices in real-time.
          </p>
        </div>

        {/* Polling Indicator Control */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700/50 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${pollingActive ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
            <span className="text-slate-300">{pollingActive ? "Live Polling" : "Polling Paused"}</span>
          </div>
          <button
            type="button"
            onClick={() => setPollingActive(!pollingActive)}
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer"
          >
            {pollingActive ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-rose-950/50 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-white font-bold px-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <ResponsiveWrapper className="w-full gap-6 items-start">
        {/* Left Column: Scrapers Grid & Session Monitor */}
        <ColumnWrapper className="basis-2/3 gap-6 w-full">
          {/* Section 1: Scrapers Grid */}
          <div className="bg-slate-800/25 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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

          {/* Section 2: Session Monitor */}
          <div className="bg-slate-800/25 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm w-full">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm0 0h5a2 2 0 002-2v-3a2 2 0 00-2-2h-5m5 13h5a2 2 0 002-2V5a2 2 0 00-2-2h-5a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
