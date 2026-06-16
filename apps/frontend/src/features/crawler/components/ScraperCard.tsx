"use client";

import { useState } from "react";

import { ScraperInfo, CrawlerSession, CrawlState, ScraperType } from "@/utils/crawler";

interface ScraperCardProps {
  scraper: ScraperInfo;
  session?: CrawlerSession;
  actionInProgress: string | null;
  onStart: (name: string, selectedProducts: string[]) => Promise<void>;
  onStop: (name: string) => Promise<void>;
}

export default function ScraperCard({
  scraper,
  session,
  actionInProgress,
  onStart,
  onStop,
}: ScraperCardProps) {
  const { name, domain, type, supportedProducts = [] } = scraper;
  const isCrawling = session?.state === CrawlState.CRAWLING;

  // Initialize selected products with all supported products directly
  const [selectedProducts, setSelectedProducts] = useState<string[]>(supportedProducts);

  const toggleProduct = (product: string) => {
    if (isCrawling) return; // Cannot change config during active crawls
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  const handleStart = () => {
    if (selectedProducts.length === 0) return;
    onStart(name, selectedProducts);
  };

  const isCurrentScraperAction = actionInProgress?.endsWith(`-${name}`);

  return (
    <div className="flex flex-col justify-between bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 rounded-xl p-5 transition-all shadow-md relative overflow-hidden group">
      {/* Background Hover Accent */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Scraper Card Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{name}</h3>
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              {domain}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Scraper Type Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              type === ScraperType.SELLERS
                ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            }`}
          >
            {type}
          </span>
        </div>

        {/* Product Targets Selection */}
        <div className="mb-6">
          <span className="text-slate-400 text-xs font-semibold block mb-2">Target Products:</span>
          {supportedProducts.length === 0 ? (
            <span className="text-slate-500 text-xs italic">No specific products specified (generic crawl)</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {supportedProducts.map((product) => {
                const isChecked = selectedProducts.includes(product);
                return (
                  <button
                    key={product}
                    type="button"
                    disabled={isCrawling}
                    onClick={() => toggleProduct(product)}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isChecked
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : "bg-slate-900/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/40"
                    } ${isCrawling ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isChecked ? "bg-blue-400" : "bg-slate-500"}`} />
                    {product}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scraper Action Panel */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
        {isCrawling ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span>Crawling...</span>
            </div>
            <button
              type="button"
              disabled={isCurrentScraperAction}
              onClick={() => onStop(name)}
              className="px-4 py-1.5 bg-rose-600/90 hover:bg-rose-600 disabled:bg-rose-800/40 disabled:text-rose-400 font-semibold text-xs text-white rounded-lg transition-colors cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              {isCurrentScraperAction && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Stop Crawl
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={selectedProducts.length === 0 || isCurrentScraperAction}
            onClick={handleStart}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800/50 disabled:border-slate-700/50 disabled:text-slate-500 text-white border border-transparent font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
          >
            {isCurrentScraperAction && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Start Background Crawl
          </button>
        )}
      </div>
    </div>
  );
}
