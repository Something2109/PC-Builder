"use client";

import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axios";
import { ScraperInfo, CrawlerSession } from "@/utils/crawler";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useCrawlerControl() {
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
      const response =
        await axiosInstance.get<CrawlerSession[]>("/crawler/status");
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
        const response =
          await axiosInstance.get<ScraperInfo[]>("/crawler/scrapers");
        if (active) {
          setScrapers(response.data);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch scrapers:", err);
        if (active) {
          const axiosErr = err as AxiosErrorLike;
          setError(
            axiosErr.response?.data?.message ||
              "Failed to load scraper configurations."
          );
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
        const response =
          await axiosInstance.get<CrawlerSession[]>("/crawler/status");
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
      setError(
        axiosErr.response?.data?.message ||
          `Failed to start crawler for '${name}'.`
      );
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
      setError(
        axiosErr.response?.data?.message ||
          `Failed to stop crawler for '${name}'.`
      );
    } finally {
      setActionInProgress(null);
    }
  };

  return {
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
  };
}
