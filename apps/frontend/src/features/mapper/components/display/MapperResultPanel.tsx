import React, { useState } from "react";
import { MapperResult, MappedItem, FailedItem } from "../../types";
import { DTOVisualizerVisual } from "./DTOVisualizerVisual";
import { MapperResultScrapedTab } from "./MapperResultScrapedTab";
import { flattenErrorObject } from "../../utils";

interface MapperResultPanelProps {
  loading: boolean;
  result: MapperResult | null;
  lastMappedJson: string;
}

interface MapperResultItemViewProps {
  type: "success" | "failed";
  index: number;
  item: MappedItem | FailedItem;
  lastMappedJson: string;
}

// Enums for Tab states
enum OutputTab {
  RESULT_VISUALIZER = "visual",
  MAPPED_SPEC_TABLE = "scraped",
  ERROR_VISUALIZER = "error",
}

enum SubTab {
  VISUAL = "visual",
  RAW = "raw",
}

const resultSubTabs = [
  { id: SubTab.VISUAL, label: "Visual Structure" },
  { id: SubTab.RAW, label: "Raw JSON DTO" },
];

const errorSubTabs = [
  { id: SubTab.VISUAL, label: "Visual Errors" },
  { id: SubTab.RAW, label: "Raw Error JSON" },
];

function MapperResultItemView({ type, index, item, lastMappedJson }: MapperResultItemViewProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>(
    type === "success" ? OutputTab.RESULT_VISUALIZER : OutputTab.ERROR_VISUALIZER
  );

  const [resultSubTab, setResultSubTab] = useState<SubTab>(SubTab.VISUAL);
  const [errorSubTab, setErrorSubTab] = useState<SubTab>(SubTab.VISUAL);

  // Determine raw scraped specs for this item
  let rawSpecs: Record<string, unknown> = {};
  if (type === "failed") {
    rawSpecs = (item as FailedItem).raw || {};
  } else {
    try {
      const parsedInput = JSON.parse(lastMappedJson);
      if (Array.isArray(parsedInput)) {
        rawSpecs = parsedInput[index] || {};
      } else if (parsedInput && typeof parsedInput === "object") {
        rawSpecs = parsedInput;
      }
    } catch {
      // fallback empty
    }
  }

  // Parse validation errors if failed
  let flatErrors: Record<string, string> = {};
  if (type === "failed") {
    const fail = item as FailedItem;
    flatErrors =
      typeof fail.error === "object" && fail.error !== null
        ? flattenErrorObject(fail.error)
        : { "": String(fail.error) };
  }

  const dataToRender =
    type === "success" ? (item as MappedItem).data : (item as FailedItem).parsed || {};

  // Tab definitions
  const mainTabs = [
    { id: OutputTab.RESULT_VISUALIZER, label: "Result Visualizer" },
    { id: OutputTab.MAPPED_SPEC_TABLE, label: "Mapped Spec Table" },
    ...(type === "failed" ? [{ id: OutputTab.ERROR_VISUALIZER, label: "Error Visualizer" }] : []),
  ];

  return (
    <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-4 space-y-4 shadow-lg text-left font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-slate-300 border border-slate-800 text-xs px-2.5 py-0.5 rounded-md font-mono font-bold">
            Index {index}
          </span>
          <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">
            Item Result
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
            type === "success"
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40"
              : "bg-rose-950/40 text-rose-400 border-rose-900/40"
          }`}
        >
          {type === "success" ? "SUCCESS" : "FAILED"}
        </span>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-900 pb-2">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? tab.id === OutputTab.ERROR_VISUALIZER
                  ? "bg-rose-900/80 text-white shadow-md"
                  : "bg-blue-900/80 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-2">
        {activeTab === OutputTab.RESULT_VISUALIZER && (
          <div className="space-y-4">
            {/* Result Visualizer Sub-Tabs */}
            <div className="flex gap-2 border-b border-slate-900 pb-2">
              {resultSubTabs.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setResultSubTab(sub.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    resultSubTab === sub.id
                      ? "bg-blue-955 text-blue-400 border border-blue-900/40"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {resultSubTab === SubTab.VISUAL ? (
              <DTOVisualizerVisual
                data={dataToRender}
                mappings={item.mappings}
                errors={flatErrors}
              />
            ) : (
              <pre className="text-slate-300 text-[11px] whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-900 max-h-80 overflow-y-auto leading-relaxed font-mono">
                {JSON.stringify(dataToRender, null, 2)}
              </pre>
            )}
          </div>
        )}

        {activeTab === OutputTab.MAPPED_SPEC_TABLE && (
          <MapperResultScrapedTab raw={rawSpecs} mappings={item.mappings} />
        )}

        {activeTab === OutputTab.ERROR_VISUALIZER && type === "failed" && (
          <div className="space-y-4">
            {/* Error Visualizer Sub-Tabs */}
            <div className="flex gap-2 border-b border-slate-900 pb-2">
              {errorSubTabs.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setErrorSubTab(sub.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    errorSubTab === sub.id
                      ? "bg-rose-955 text-rose-400 border border-rose-900/40"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {errorSubTab === SubTab.VISUAL ? (
              <DTOVisualizerVisual
                data={dataToRender}
                mappings={item.mappings}
                errors={flatErrors}
                onlyErrors={true}
              />
            ) : (
              <pre className="text-rose-300 text-[11px] whitespace-pre-wrap bg-slate-955 p-3 rounded-lg border border-slate-900 max-h-80 overflow-y-auto leading-relaxed font-mono">
                {JSON.stringify((item as FailedItem).error, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapperResultPanel({
  loading,
  result,
  lastMappedJson,
}: MapperResultPanelProps) {
  // Combine mapped and failed items, sorted by index
  const allItems = [
    ...(result?.mapped || []).map((item) => ({
      type: "success" as const,
      index: item.index,
      item,
    })),
    ...(result?.failed || []).map((item) => ({ type: "failed" as const, index: item.index, item })),
  ].sort((a, b) => a.index - b.index);

  return (
    <div className="lg:col-span-7 flex flex-col gap-1.5 h-full">
      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-left">
        Mapping Output
      </label>
      <div className="bg-slate-955 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-auto flex-1 min-h-100 max-h-150 lg:max-h-175 leading-relaxed">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Parsing specs & resolving aliases...</span>
          </div>
        ) : result ? (
          <div className="space-y-6">
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
                  Mapped Fields: <span className="text-white font-bold">{result.mappedCount}</span>
                </div>
                <div>
                  Failures: <span className="text-white font-bold">{result.failedCount}</span>
                </div>
              </div>
            </div>

            {/* List of items */}
            {allItems.length > 0 ? (
              <div className="space-y-6">
                {allItems.map(({ type, index, item }) => (
                  <MapperResultItemView
                    key={`${type}-${index}`}
                    type={type}
                    index={index}
                    item={item}
                    lastMappedJson={lastMappedJson}
                  />
                ))}
              </div>
            ) : (
              <div className="text-slate-500 italic text-center py-8">
                No items returned in mapping response.
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
  );
}
