"use client";

import React, { useState } from "react";
import { MappingTrace } from "../types";
import { getErrorAtPath, hasErrorInSubtree, findSourceRawKey } from "../utils";

export const DTOVisualizer = ({
  data,
  mappings,
  errors,
}: {
  data: Record<string, unknown>;
  mappings?: MappingTrace;
  errors?: Record<string, string>;
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");

  const basicFields = [
    "name",
    "code_name",
    "brand",
    "series",
    "launch_date",
    "url",
    "image_url",
    "part",
  ];

  const basicInfo: [string, unknown][] = basicFields.map((key) => [key, data[key]]);
  const detailedInfoKeys = new Set<string>([
    ...Object.keys(data).filter((key) => !basicFields.includes(key)),
    ...(errors
      ? Object.keys(errors)
          .map((k) => k.split(".")[0])
          .filter((k) => k && !basicFields.includes(k))
      : []),
  ]);
  const detailedInfo: [string, unknown][] = Array.from(detailedInfoKeys).map((key) => [
    key,
    data[key],
  ]);

  return (
    <div className="space-y-4 text-left font-sans">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("visual")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "visual"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          Visual Structure
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("raw")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "raw"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          Raw JSON DTO
        </button>
      </div>

      {activeTab === "raw" ? (
        <pre className="text-slate-300 text-[11px] whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-[500px] overflow-y-auto leading-relaxed font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Basic Fields Card */}
          {basicInfo.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {basicInfo.map(([key, val]) => {
                  const errorMsg = errors ? getErrorAtPath(errors, key) : undefined;
                  const source = mappings ? findSourceRawKey(key, mappings) : null;
                  return (
                    <div
                      key={key}
                      className={`flex flex-col gap-1.5 p-3 rounded-lg border transition-all ${
                        errorMsg
                          ? "bg-rose-950/10 border-rose-900/50 shadow-md shadow-rose-950/5"
                          : "bg-slate-950/40 border-slate-800/30"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {key.replace("_", " ")}
                        </span>
                        {source && (
                          <span
                            className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-mono truncate max-w-[150px]"
                            title={`Mapped from: "${source.rawKey}" (${source.matchType} match)`}
                          >
                            from: &quot;{source.rawKey}&quot;
                          </span>
                        )}
                      </div>
                      <span className="text-slate-200 font-semibold break-all text-sm">
                        {val === undefined
                          ? ""
                          : typeof val === "object" && val !== null
                            ? JSON.stringify(val)
                            : String(val)}
                      </span>
                      {errorMsg && (
                        <span className="text-xs text-rose-400 font-medium bg-rose-950/30 border border-rose-900/40 px-2 py-1 rounded mt-1 flex items-start gap-1.5">
                          <svg className="w-3.5 h-3.5 fill-rose-400 shrink-0 mt-0.5" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="break-words whitespace-normal leading-relaxed">{errorMsg}</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Info Cards */}
          {detailedInfo.map(([key, val]) => {
            const hasError = errors ? hasErrorInSubtree(errors, key) : false;
            return (
              <div
                key={key}
                className={`border rounded-xl p-4 space-y-3 transition-all ${
                  hasError
                    ? "bg-rose-950/5 border-rose-900/50 shadow-md shadow-rose-950/2"
                    : "bg-slate-900/40 border-slate-800"
                }`}
              >
                <h3
                  className={`font-bold uppercase tracking-wider text-[10px] ${
                    hasError ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {key.replace("_", " ")}
                </h3>
                {Array.isArray(val) ? (
                  <div className="space-y-3">
                    {val.map((item, idx) => {
                      const itemPath = `${key}.${idx}`;
                      const itemHasError = errors ? hasErrorInSubtree(errors, itemPath) : false;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg flex flex-col gap-3 border transition-all ${
                            itemHasError
                              ? "bg-rose-950/10 border-rose-900/30"
                              : "bg-slate-950/80 border-slate-800/50"
                          }`}
                        >
                          <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Item #{idx + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(() => {
                              const subKeys = new Set<string>([
                                ...Object.keys(item),
                                ...(errors
                                  ? Object.keys(errors)
                                      .filter((k) => k.startsWith(`${key}.${idx}.`))
                                      .map(
                                        (k) => k.substring(`${key}.${idx}.`.length).split(".")[0]
                                      )
                                      .filter(Boolean)
                                  : []),
                              ]);
                              return Array.from(subKeys).map((subKey) => {
                                const subVal = (item as Record<string, unknown>)[subKey];
                                const subPath = `${key}.${idx}.${subKey}`;
                                const errorMsg = errors
                                  ? getErrorAtPath(errors, subPath)
                                  : undefined;
                                const source = mappings
                                  ? findSourceRawKey(subPath, mappings)
                                  : null;
                                return (
                                  <div
                                    key={subKey}
                                    className={`flex flex-col gap-1.5 p-2 rounded-md border ${
                                      errorMsg
                                        ? "bg-rose-950/20 border-rose-900/40"
                                        : "bg-slate-900/40 border-slate-800/20"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center gap-2">
                                      <span className="text-[10px] text-slate-500 font-medium uppercase">
                                        {subKey.replace("_", " ")}
                                      </span>
                                      {source && (
                                        <span
                                          className="text-[8px] bg-slate-950 text-slate-500 border border-slate-850 px-1 py-0.2 rounded font-mono truncate max-w-[120px]"
                                          title={`Mapped from: "${source.rawKey}" (${source.matchType} match)`}
                                        >
                                          from: &quot;{source.rawKey}&quot;
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-slate-300 font-medium text-xs break-all">
                                      {subVal === undefined
                                        ? ""
                                        : typeof subVal === "object" && subVal !== null
                                          ? JSON.stringify(subVal)
                                          : String(subVal)}
                                    </span>
                                    {errorMsg && (
                                      <span className="text-[11px] text-rose-400 font-medium mt-1 flex items-start gap-1.5">
                                        <svg
                                          className="w-3.5 h-3.5 fill-rose-400 shrink-0 mt-0.5"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="break-words whitespace-normal leading-relaxed">{errorMsg}</span>
                                      </span>
                                    )}
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : typeof val === "object" && val !== null ? (
                  (() => {
                    const subKeys = new Set<string>([
                      ...Object.keys(val),
                      ...(errors
                        ? Object.keys(errors)
                            .filter((k) => k.startsWith(`${key}.`))
                            .map((k) => k.substring(`${key}.`.length).split(".")[0])
                            .filter(Boolean)
                        : []),
                    ]);
                    return (
                      <div className="bg-slate-950/80 border border-slate-800/50 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from(subKeys).map((subKey) => {
                          const subVal = (val as Record<string, unknown>)[subKey];
                          const subPath = `${key}.${subKey}`;
                          const errorMsg = errors ? getErrorAtPath(errors, subPath) : undefined;
                          const source = mappings ? findSourceRawKey(subPath, mappings) : null;
                          return (
                            <div
                              key={subKey}
                              className={`flex flex-col gap-1.5 p-2 rounded-md border ${
                                errorMsg
                                  ? "bg-rose-950/20 border-rose-900/40"
                                  : "bg-slate-900/40 border-slate-800/20"
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-medium uppercase">
                                  {subKey.replace("_", " ")}
                                </span>
                                {source && (
                                  <span
                                    className="text-[8px] bg-slate-950 text-slate-500 border border-slate-850 px-1 py-0.2 rounded font-mono truncate max-w-[120px]"
                                    title={`Mapped from: "${source.rawKey}" (${source.matchType} match)`}
                                  >
                                    from: &quot;{source.rawKey}&quot;
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-300 font-medium text-xs break-all">
                                {subVal === undefined
                                  ? ""
                                  : typeof subVal === "object" && subVal !== null
                                    ? JSON.stringify(subVal)
                                    : String(subVal)}
                              </span>
                              {errorMsg && (
                                <span className="text-[11px] text-rose-400 font-medium mt-1 flex items-start gap-1.5">
                                  <svg
                                    className="w-3.5 h-3.5 fill-rose-400 shrink-0 mt-0.5"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="break-words whitespace-normal leading-relaxed">{errorMsg}</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                ) : val === undefined ? (
                  <div className="bg-rose-950/10 border border-rose-900/30 p-3 rounded-lg text-rose-300 italic text-xs">
                    Field was not parsed/extracted from raw specs
                  </div>
                ) : (
                  <span className="text-slate-300">{String(val)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
