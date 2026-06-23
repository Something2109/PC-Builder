"use client";

import { Products } from "@pc-builder/shared/part";
import Link from "next/link";
import React, { useState } from "react";

import axiosInstance from "@/lib/axios";

const SAMPLE_TEMPLATES: Record<string, string> = {
  mainboard: JSON.stringify(
    {
      Model: "Z790 AORUS XTREME X ICE",
      Brand: "Gigabyte",
      USB: "Chipset+Intel® Thunderbolt™ 4 Controller:\n<ol>\n<li>2 x USB Type-C® ports on the back panel, with USB 3.2 Gen 2 support</li>\n</ol>\n\nChipset:\n<ol>\n<li>2 x USB Type-C® ports with USB 3.2 Gen 2x2 support, available through the internal USB header</li>\n<li>2 x USB 3.2 Gen 2 Type-A ports (red) on the back panel</li>\n</ol>",
      "Back Panel Connectors":
        "<ol>\n<li>10 x USB 3.2 Gen 2 Type-A ports (red)</li>\n<li>2 x RJ-45 ports</li>\n</ol>",
      "Form Factor": "E-ATX Form Factor; 30.5cm x 28.5cm",
      Chipset: "Intel Z790 Express Chipset",
    },
    null,
    2
  ),
  cpu: JSON.stringify(
    {
      Model: "Intel Core i9-14900K",
      Brand: "Intel",
      CPU: "Intel Core i9-14900K",
      Cores: "24 cores (8 P-cores + 16 E-cores)",
      "L3 Cache": "36 MB Smart Cache",
      TDP: "125 W",
    },
    null,
    2
  ),
  gpu: JSON.stringify(
    {
      Model: "NVIDIA GeForce RTX 4090",
      Brand: "NVIDIA",
      "Core Clock": "2235 MHz",
      "Boost Clock": "2520 MHz",
      "Memory Size": "24 GB",
      "Memory Type": "GDDR6X",
    },
    null,
    2
  ),
  graphic_card: JSON.stringify(
    {
      Model: "ASUS ROG Strix RTX 4080 Super",
      Brand: "ASUS",
      cardwidth: "150 mm",
      cardlength: "357 mm",
      cardheight: "70 mm",
      recommendedpower: "850 W",
      outputs: "2x HDMI 2.1a | 3x DisplayPort 1.4a",
    },
    null,
    2
  ),
  ram: JSON.stringify(
    {
      Model: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
      Brand: "G.Skill",
      memoryspeed: "6000 MHz",
      memorysize: "32 GB",
      modules: "2x 16 GB",
      ddrtype: "DDR5",
    },
    null,
    2
  ),
  ssd: JSON.stringify(
    {
      Model: "Samsung 990 Pro 2TB M.2 NVMe SSD",
      Brand: "Samsung",
      size: "2 TB",
      formfactor: "M.2 2280",
      storageinterface: "PCIe Gen 4.0 x4",
      readspeed: "7450 MB/s",
      writespeed: "6900 MB/s",
    },
    null,
    2
  ),
  hdd: JSON.stringify(
    {
      Model: 'Seagate BarraCuda 2TB 3.5" HDD',
      Brand: "Seagate",
      storagesize: "2 TB",
      formfactor: "3.5 inch",
      storageinterface: "SATA III",
      rpm: "7200 RPM",
    },
    null,
    2
  ),
  psu: JSON.stringify(
    {
      Model: "Corsair RM1000x 1000W PSU",
      Brand: "Corsair",
      poweroutput: "1000 W",
      certification: "80 Plus Gold",
      modularity: "Fully Modular",
    },
    null,
    2
  ),
  case: JSON.stringify(
    {
      Model: "Lian Li PC-O11 Dynamic EVO",
      Brand: "Lian Li",
      casetype: "Mid Tower",
      motherboardsupport: "E-ATX, ATX, Micro-ATX, Mini-ITX",
      cpucoolerheight: "167 mm",
      maxpsulength: "220 mm",
    },
    null,
    2
  ),
  cooler: JSON.stringify(
    {
      Model: "Noctua NH-D15 chromax.black",
      Brand: "Noctua",
      socketsupported: "LGA1700, LGA1200, AM4, AM5",
      fansize: "140 mm",
      fancount: "2 fans",
      rpm: "1500 RPM",
    },
    null,
    2
  ),
  aio: JSON.stringify(
    {
      Model: "Corsair iCUE H150i Elite Capellix XT",
      Brand: "Corsair",
      socketssupported: "LGA1700, LGA1200, AM4, AM5",
      radiatorsize: "360 mm",
      fansize: "120 mm",
    },
    null,
    2
  ),
};

interface MappedItem {
  index: number;
  data: Record<string, unknown>;
}

interface FailedItem {
  index: number;
  raw: Record<string, unknown>;
  error: unknown;
}

interface MapperResult {
  success: boolean;
  mappedCount: number;
  failedCount: number;
  mapped: MappedItem[];
  failed: FailedItem[];
}

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function MapperTest() {
  const [productType, setProductType] = useState<string>("mainboard");
  const [fallbackBrand, setFallbackBrand] = useState<string>("");
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_TEMPLATES.mainboard);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MapperResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // 1. Validate JSON Client-side
    let parsedInput: unknown;
    try {
      parsedInput = JSON.parse(jsonInput);
    } catch (err: unknown) {
      const parseErr = err as Error;
      setError(`Invalid JSON input: ${parseErr.message}`);
      return;
    }

    try {
      setLoading(true);

      const url = `/mapper/map/${productType}`;
      const params = fallbackBrand ? { fallbackBrand } : undefined;

      const response = await axiosInstance.post<MapperResult>(url, parsedInput, { params });
      setResult(response.data);
    } catch (err: unknown) {
      console.error("Mapping test failed:", err);
      const axiosErr = err as AxiosErrorLike;
      setError(
        axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Mapping endpoint error. Check server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-6 text-line bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Specs Mapper Tester
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Validate and test raw key-value scraped specs mapping into structured product schemas
            on-demand.
          </p>
        </div>
        <Link
          href="/crawler"
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-600 transition-all shadow-md cursor-pointer"
        >
          &larr; Back to Crawler
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Panel */}
        <form onSubmit={handleTestMapping} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Product Selector */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => {
                  const val = e.target.value;
                  setProductType(val);
                  setJsonInput(
                    SAMPLE_TEMPLATES[val] ||
                      '{\n  "Model": "Sample Model",\n  "Brand": "Sample Brand"\n}'
                  );
                }}
                className="bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {Object.values(Products).map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Fallback Brand */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Fallback Brand (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Gigabyte"
                value={fallbackBrand}
                onChange={(e) => setFallbackBrand(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* JSON Textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-between items-center">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Raw Scraped Specs JSON
              </label>
              <button
                type="button"
                onClick={() => {
                  const template = SAMPLE_TEMPLATES[productType] || "{}";
                  setJsonInput(template);
                }}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline"
              >
                Reset to Template
              </button>
            </div>
            <textarea
              required
              rows={16}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste raw spec JSON here..."
              className="font-mono bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-y leading-relaxed"
            />
          </div>

          {error && (
            <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
              <strong>Error:</strong> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Run Mapping Test &rarr;
          </button>
        </form>

        {/* Output Panel */}
        <div className="flex flex-col gap-1.5 h-full">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Mapping Output
          </label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-auto flex-1 min-h-[300px] max-h-[500px] lg:max-h-[600px] leading-relaxed">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Parsing specs & validating fields...</span>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Status metrics */}
                <div className="flex gap-4 text-[10px] text-slate-400 border-b border-slate-800 pb-2.5">
                  <div>
                    Parsed Status:{" "}
                    <span
                      className={
                        result.failedCount === 0
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {result.failedCount === 0 ? "SUCCESS" : "VALIDATION ERRORS"}
                    </span>
                  </div>
                  <div>
                    Mapped Fields:{" "}
                    <span className="text-white font-bold">{result.mappedCount}</span>
                  </div>
                  <div>
                    Failures: <span className="text-white font-bold">{result.failedCount}</span>
                  </div>
                </div>

                {/* Display validation errors if any */}
                {result.failedCount > 0 &&
                  result.failed.map((fail: FailedItem, i: number) => (
                    <div
                      key={i}
                      className="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg text-rose-400 text-[11px] whitespace-pre-wrap"
                    >
                      <div className="font-bold mb-1">Index {fail.index} Error:</div>
                      {JSON.stringify(fail.error, null, 2)}
                    </div>
                  ))}

                {/* Display mapped object DTO */}
                {result.mapped.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Parsed DTO Output:
                    </div>
                    <pre className="text-slate-300 text-[11px] whitespace-pre-wrap">
                      {JSON.stringify(result.mapped[0].data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 italic">
                Ready. Select a product type, adjust templates, and click &quot;Run Mapping
                Test&quot; to inspect results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
