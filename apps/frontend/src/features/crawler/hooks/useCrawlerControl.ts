"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch available scrapers
  const { data: scrapers = [], isLoading: loadingScrapers } = useQuery<ScraperInfo[]>({
    queryKey: ["crawlerScrapers"],
    queryFn: async () => {
      const response = await axiosInstance.get<ScraperInfo[]>("/crawler/scrapers");
      return response.data;
    },
  });

  // Poll active crawler sessions
  const { data: sessions = [] } = useQuery<CrawlerSession[]>({
    queryKey: ["crawlerSessions"],
    queryFn: async () => {
      const response = await axiosInstance.get<CrawlerSession[]>("/crawler/status");
      return response.data;
    },
    refetchInterval: pollingActive ? 3000 : false,
  });

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
