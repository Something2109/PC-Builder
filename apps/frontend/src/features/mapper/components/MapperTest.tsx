"use client";

import { Products } from "@pc-builder/shared/part";
import Link from "next/link";
import React, { useState } from "react";

import axiosInstance from "@/lib/axios";

import { MapperResult, KeyValueRow, FailedItem, AxiosErrorLike } from "../types";
import { jsonToRows, rowsToJson, findMappedDTOPath } from "../utils";
import { FormInputsEditor } from "./FormInputsEditor";
import { DTOVisualizer } from "./DTOVisualizer";
import { FailedItemView } from "./FailedItemView";

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

export default function MapperTest() {
  const [productType, setProductType] = useState<string>("mainboard");
  const [fallbackBrand, setFallbackBrand] = useState<string>("");

  // Input states: bi-directional JSON & Form modes
  const [inputMode, setInputMode] = useState<"form" | "json">("form");
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_TEMPLATES.mainboard);
  const [keyValueRows, setKeyValueRows] = useState<KeyValueRow[]>(
    jsonToRows(SAMPLE_TEMPLATES.mainboard)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MapperResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Success view tab state
  const [successTab, setSuccessTab] = useState<"visual" | "scraped" | "dto">("visual");

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      if (!val.trim()) {
        setKeyValueRows([]);
        setJsonError(null);
        return;
      }
      const parsed = JSON.parse(val);
      setJsonError(null);

      // Convert parsed JSON into editable Key-Value Rows
      const rows = Object.entries(parsed).map(([k, v]) => ({
        key: k,
        value: typeof v === "object" ? JSON.stringify(v, null, 2) : String(v),
      }));
      setKeyValueRows(rows);
    } catch (e) {
      const err = e as Error;
      setJsonError(`JSON Parse Warning: ${err.message}`);
    }
  };

  const handleRowsChange = (newRows: KeyValueRow[]) => {
    setKeyValueRows(newRows);
    const jsonStr = rowsToJson(newRows);
    setJsonInput(jsonStr);
    setJsonError(null);
  };

  const handleRowKeyChange = (index: number, newKey: string) => {
    const updated = [...keyValueRows];
    updated[index].key = newKey;
    handleRowsChange(updated);
  };

  const handleRowValueChange = (index: number, newVal: string) => {
    const updated = [...keyValueRows];
    updated[index].value = newVal;
    handleRowsChange(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = keyValueRows.filter((_, i) => i !== index);
    handleRowsChange(updated);
  };

  const handleAddRow = () => {
    handleRowsChange([...keyValueRows, { key: "", value: "" }]);
  };

  const handleTestMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate JSON client-side
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
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 text-slate-200 bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Panel (cols 5) */}
        <form onSubmit={handleTestMapping} className="lg:col-span-5 flex flex-col gap-4">
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
                  const newTemplate =
                    SAMPLE_TEMPLATES[val] ||
                    '{\n  "Model": "Sample Model",\n  "Brand": "Sample Brand"\n}';
                  setJsonInput(newTemplate);
                  setKeyValueRows(jsonToRows(newTemplate));
                  setJsonError(null);
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

          {/* Input Panel Redesign */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <div className="flex gap-1 border border-slate-800 bg-slate-950/60 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setInputMode("form")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    inputMode === "form" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Form Inputs
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("json")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    inputMode === "json" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Raw JSON
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const template = SAMPLE_TEMPLATES[productType] || "{}";
                  setJsonInput(template);
                  setKeyValueRows(jsonToRows(template));
                  setJsonError(null);
                }}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline"
              >
                Reset to Template
              </button>
            </div>

            {/* Input Panels */}
            {inputMode === "form" ? (
              <FormInputsEditor
                keyValueRows={keyValueRows}
                onRowKeyChange={handleRowKeyChange}
                onRowValueChange={handleRowValueChange}
                onDeleteRow={handleDeleteRow}
                onAddRow={handleAddRow}
              />
            ) : (
              <div className="flex flex-col gap-1.5">
                <textarea
                  required
                  rows={15}
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder="Paste raw spec JSON here..."
                  className="font-mono bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-y leading-relaxed"
                />
                {jsonError && (
                  <div className="text-amber-500 font-semibold text-[10px] bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg">
                    ⚠️ {jsonError}
                  </div>
                )}
              </div>
            )}
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

        {/* Right: Output Panel (cols 7) */}
        <div className="lg:col-span-7 flex flex-col gap-1.5 h-full">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-left">
            Mapping Output
          </label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-auto flex-1 min-h-[400px] max-h-[600px] lg:max-h-[700px] leading-relaxed">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Parsing specs & resolving aliases...</span>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Status metrics */}
                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 border-b border-slate-850 pb-2.5 justify-between">
                  <div className="flex gap-4">
                    <div>
                      Status:{" "}
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
                      Failures:{" "}
                      <span className="text-white font-bold">{result.failedCount}</span>
                    </div>
                  </div>
                </div>

                {/* Display validation errors if any */}
                {result.failedCount > 0 && (
                  <div className="space-y-4">
                    {result.failed.map((fail: FailedItem, i: number) => (
                      <FailedItemView key={i} fail={fail} />
                    ))}
                  </div>
                )}

                {/* Display mapped object DTO */}
                {result.mapped.length > 0 && (
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 text-xs px-2 py-0.5 rounded font-mono font-bold">
                        Index {result.mapped[0].index}
                      </span>
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        Mapped DTO Result
                      </span>
                    </div>

                    {/* Success tabs */}
                    <div className="flex flex-wrap gap-1.5 border-b border-slate-900 pb-2">
                      <button
                        type="button"
                        onClick={() => setSuccessTab("visual")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          successTab === "visual"
                            ? "bg-emerald-900/80 text-white shadow-md shadow-emerald-900/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                        }`}
                      >
                        Visual Structure
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuccessTab("scraped")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          successTab === "scraped"
                            ? "bg-emerald-900/80 text-white shadow-md shadow-emerald-900/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                        }`}
                      >
                        Scraped Specs Mapping Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuccessTab("dto")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          successTab === "dto"
                            ? "bg-emerald-900/80 text-white shadow-md shadow-emerald-900/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                        }`}
                      >
                        Raw DTO JSON
                      </button>
                    </div>

                    {/* Success panels */}
                    <div>
                      {successTab === "visual" && (
                        <DTOVisualizer
                          data={result.mapped[0].data}
                          mappings={result.mapped[0].mappings}
                        />
                      )}

                      {successTab === "scraped" && (
                        <div className="border border-slate-850 rounded-lg overflow-hidden">
                          <table className="w-full text-[11px] border-collapse text-left">
                            <thead>
                              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                                <th className="p-2.5">Raw Scraped Key</th>
                                <th className="p-2.5">Scraped Value</th>
                                <th className="p-2.5">Mapped to DTO Path</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 bg-slate-950/20 font-sans">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(jsonInput) as Record<string, unknown>;
                                  return Object.entries(parsed).map(([k, v]) => {
                                    const dtoPath = findMappedDTOPath(k, result.mapped[0].mappings);
                                    return (
                                      <tr key={k} className="hover:bg-slate-900/20 transition-colors">
                                        <td className="p-2.5 font-mono text-slate-300 font-bold break-all max-w-[150px]">
                                          {k}
                                        </td>
                                        <td className="p-2.5 text-slate-400 break-all whitespace-pre-wrap max-h-40 overflow-y-auto max-w-[300px]">
                                          {String(v)}
                                        </td>
                                        <td className="p-2.5">
                                          {dtoPath ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono">
                                              <span>➔</span>
                                              <span>{dtoPath}</span>
                                            </span>
                                          ) : (
                                            <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono">
                                              Skipped / Unused
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  });
                                } catch {
                                  return (
                                    <tr>
                                      <td colSpan={3} className="p-3 text-center text-slate-500 italic">
                                        Unable to parse raw input specs.
                                      </td>
                                    </tr>
                                  );
                                }
                              })()}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {successTab === "dto" && (
                        <pre className="text-slate-300 text-[11px] whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-[500px] overflow-y-auto leading-relaxed font-mono">
                          {JSON.stringify(result.mapped[0].data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 italic">
                Ready. Select a product type, adjust templates/inputs, and click &quot;Run Mapping
                Test&quot; to inspect results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
