"use client";

import { ScraperInfo, CrawlerSession, CrawlProcessLog } from "@pc-builder/shared/crawler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, createContext, useContext, ReactNode } from "react";

import axiosInstance from "@/lib/axios";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// 1. Standalone Query Hook for Scrapers (Rarely updates, no polling)
export function useCrawlerScrapers() {
  return useQuery<ScraperInfo[]>({
    queryKey: ["crawlerScrapers"],
    queryFn: async () => {
      const response = await axiosInstance.get<ScraperInfo[]>("/crawler/scrapers");
      return response.data;
    },
  });
}

// 2. Standalone Query Hook for Sessions (Updates frequently via polling)
export function useCrawlerSessions(pollingActive = true) {
  return useQuery<CrawlerSession[]>({
    queryKey: ["crawlerSessions"],
    queryFn: async () => {
      const response = await axiosInstance.get<CrawlerSession[]>("/crawler/status");
      return response.data;
    },
    refetchInterval: pollingActive ? 3000 : false,
  });
}

// 3. Crawler Control Context & Provider
interface CrawlerControlContextType {
  error: string | null;
  setError: (error: string | null) => void;
  pollingActive: boolean;
  setPollingActive: (active: boolean) => void;
  actionInProgress: string | null;
  handleStartCrawl: (name: string, selectedProducts: string[]) => Promise<void>;
  handleStopCrawl: (name: string) => Promise<void>;
}

const CrawlerControlContext = createContext<CrawlerControlContextType | undefined>(undefined);

export function CrawlerControlProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Start crawl session mutation
  const startCrawlMutation = useMutation({
    mutationFn: async ({
      name,
      selectedProducts,
    }: {
      name: string;
      selectedProducts: string[];
    }) => {
      await axiosInstance.post("/crawler/start", {
        name,
        products: selectedProducts,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crawlerSessions"] });
    },
    onError: (err: unknown) => {
      console.error("Failed to start crawl:", err);
      const axiosErr = err as AxiosErrorLike;
      setError(axiosErr.response?.data?.message || "Failed to start crawler.");
    },
  });

  // Stop crawl session mutation
  const stopCrawlMutation = useMutation({
    mutationFn: async (name: string) => {
      await axiosInstance.post("/crawler/stop", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crawlerSessions"] });
    },
    onError: (err: unknown) => {
      console.error("Failed to stop crawl:", err);
      const axiosErr = err as AxiosErrorLike;
      setError(axiosErr.response?.data?.message || "Failed to stop crawler.");
    },
  });

  const handleStartCrawl = async (name: string, selectedProducts: string[]) => {
    setActionInProgress(`start-${name}`);
    setError(null);
    try {
      await startCrawlMutation.mutateAsync({ name, selectedProducts });
    } catch {
      // Handled in onError of mutation
    } finally {
      setActionInProgress(null);
    }
  };

  const handleStopCrawl = async (name: string) => {
    setActionInProgress(`stop-${name}`);
    setError(null);
    try {
      await stopCrawlMutation.mutateAsync(name);
    } catch {
      // Handled in onError of mutation
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <CrawlerControlContext.Provider
      value={{
        error,
        setError,
        pollingActive,
        setPollingActive,
        actionInProgress,
        handleStartCrawl,
        handleStopCrawl,
      }}
    >
      {children}
    </CrawlerControlContext.Provider>
  );
}

// 4. Hook to consume Crawler Control Context
export function useCrawlerControl() {
  const context = useContext(CrawlerControlContext);
  if (context === undefined) {
    throw new Error("useCrawlerControl must be used within a CrawlerControlProvider");
  }
  return context;
}

// 5. Standalone Query Hook for traces
export function useCrawlerTraces(
  sessionId?: string,
  scraperName?: string,
  page = 1,
  limit = 50,
  pollingActive = true
) {
  return useQuery({
    queryKey: ["crawlerTraces", sessionId, scraperName, page, limit],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (sessionId) params.sessionId = sessionId;
      if (scraperName) params.scraperName = scraperName;

      const response = await axiosInstance.get<{
        list: CrawlProcessLog[];
        total: number;
        page: number;
        limit: number;
        pages: number;
      }>("/crawler/traces", { params });
      return response.data;
    },
    enabled: Boolean(sessionId || scraperName),
    refetchInterval: pollingActive ? 3000 : false,
  });
}
