"use client";

import Link from "next/link";
import { useState } from "react";

import axiosInstance from "@/lib/axios";
import { ScraperInfo, Products } from "@pc-builder/shared/crawler";

interface InteractiveToolsProps {
  scrapers: ScraperInfo[];
}

interface ProductItem {
  name: string;
  price?: number;
  link: string;
  img?: string | null;
  availability?: boolean;
}

interface ToolResponse {
  success: boolean;
  count: number;
  items?: ProductItem[];
}

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type TabType = "extract" | "test";

export default function InteractiveTools({ scrapers }: InteractiveToolsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("extract");

  // Tab 1: Manual Extract Form State
  const [extractUrl, setExtractUrl] = useState("");
  const [extractScraper, setExtractScraper] = useState("");
  const [extractProduct, setExtractProduct] = useState("");
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractResult, setExtractResult] = useState<ToolResponse | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Tab 2: Scraper Test Form State
  const [testScraper, setTestScraper] = useState("");
  const [testProduct, setTestProduct] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<ToolResponse | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Find supported products for selected scrapers
  const selectedExtractScraperObj = scrapers.find((s) => s.name === extractScraper);
  const extractSupportedProducts =
    selectedExtractScraperObj?.supportedProducts || Object.values(Products);

  const selectedTestScraperObj = scrapers.find((s) => s.name === testScraper);
  const testSupportedProducts =
    selectedTestScraperObj?.supportedProducts || Object.values(Products);

  // Handle Manual Extraction
  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractUrl || !extractScraper || !extractProduct) {
      setExtractError("Please fill out all fields.");
      return;
    }

    try {
      setExtractLoading(true);
      setExtractError(null);
      setExtractResult(null);

      const response = await axiosInstance.post<ToolResponse>("/crawler/extract", {
        name: extractScraper,
        url: extractUrl,
        product: extractProduct,
      });

      setExtractResult(response.data);
    } catch (err: unknown) {
      console.error("Manual extraction failed:", err);
      const axiosErr = err as AxiosErrorLike;
      setExtractError(
        axiosErr.response?.data?.message || "Extraction failed. Check url or crawler logs."
      );
    } finally {
      setExtractLoading(false);
    }
  };

  // Handle First Page Test
  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testScraper || !testProduct) {
      setTestError("Please select both a scraper and a product.");
      return;
    }

    try {
      setTestLoading(true);
      setTestError(null);
      setTestResult(null);

      const response = await axiosInstance.post<ToolResponse>("/crawler/test", {
        name: testScraper,
        product: testProduct,
      });

      setTestResult(response.data);
    } catch (err: unknown) {
      console.error("Test crawl failed:", err);
      const axiosErr = err as AxiosErrorLike;
      setTestError(axiosErr.response?.data?.message || "Test crawl failed.");
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tab Selectors */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("extract")}
          className={`flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
            activeTab === "extract"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Manual Extract
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("test")}
          className={`flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${
            activeTab === "test"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Scraper Test
        </button>
      </div>

      {/* Tab 1: Manual Extract Panel */}
      {activeTab === "extract" && (
        <form onSubmit={handleExtract} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Select Scraper</label>
            <select
              required
              value={extractScraper}
              onChange={(e) => {
                setExtractScraper(e.target.value);
                setExtractProduct(""); // reset product on scraper change
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Scraper --</option>
              {scrapers.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name.toUpperCase()} ({s.domain})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Product Type</label>
            <select
              required
              value={extractProduct}
              onChange={(e) => setExtractProduct(e.target.value)}
              disabled={!extractScraper}
              className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">-- Choose Product --</option>
              {extractSupportedProducts.map((p) => (
                <option key={p} value={p}>
                  {String(p).toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Product Page URL</label>
            <input
              required
              type="url"
              placeholder="https://example.com/product/abc"
              value={extractUrl}
              onChange={(e) => setExtractUrl(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {extractError && (
            <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-2.5 rounded-lg">
              {extractError}
            </div>
          )}

          <button
            type="submit"
            disabled={extractLoading || !extractScraper || !extractProduct || !extractUrl}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
          >
            {extractLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Extract & Save to DB
          </button>

          {/* Extract Result Display */}
          {extractResult && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 mt-2 flex flex-col gap-2">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                ✓ Extracted Successfully ({extractResult.count} items persisted)
              </span>
              {extractResult.items && extractResult.items.length > 0 && (
                <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                  <div className="font-bold text-white border-b border-slate-800 pb-1">
                    {extractResult.items[0].name}
                  </div>
                  <div>
                    Price:{" "}
                    <span className="text-emerald-400 font-bold">
                      {extractResult.items[0].price?.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="truncate text-slate-500">
                    Link:{" "}
                    <Link
                      href={extractResult.items[0].link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {extractResult.items[0].link}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {/* Tab 2: Scraper Test Panel */}
      {activeTab === "test" && (
        <form onSubmit={handleTest} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Select Scraper</label>
            <select
              required
              value={testScraper}
              onChange={(e) => {
                setTestScraper(e.target.value);
                setTestProduct(""); // reset product on scraper change
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Scraper --</option>
              {scrapers.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name.toUpperCase()} ({s.domain})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold">Product Type</label>
            <select
              required
              value={testProduct}
              onChange={(e) => setTestProduct(e.target.value)}
              disabled={!testScraper}
              className="bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">-- Choose Product --</option>
              {testSupportedProducts.map((p) => (
                <option key={p} value={p}>
                  {String(p).toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {testError && (
            <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-2.5 rounded-lg">
              {testError}
            </div>
          )}

          <button
            type="submit"
            disabled={testLoading || !testScraper || !testProduct}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
          >
            {testLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Run First Page Test
          </button>

          {/* Test Result Display */}
          {testResult && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 mt-2 flex flex-col gap-3">
              <span className="text-xs text-emerald-400 font-semibold">
                ✓ Test Completed ({testResult.count} items found)
              </span>

              {testResult.items && testResult.items.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  <span className="text-[10px] text-slate-500 border-b border-slate-800 pb-1 font-bold uppercase tracking-wider">
                    First 5 Extracted Items:
                  </span>
                  {testResult.items.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="text-[10px] bg-slate-900/80 border border-slate-800/80 p-2 rounded flex flex-col gap-0.5"
                    >
                      <div className="font-bold text-slate-200 line-clamp-1">{item.name}</div>
                      <div className="text-emerald-400 font-semibold">
                        {item.price?.toLocaleString()} VND
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">No products found on page 1.</span>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
