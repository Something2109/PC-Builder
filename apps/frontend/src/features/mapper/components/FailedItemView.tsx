"use client";

import React, { useState } from "react";
import { FailedItem } from "../types";
import { flattenErrorObject, findMappedDTOPath } from "../utils";
import { DTOVisualizer } from "./DTOVisualizer";

export const FailedItemView = ({ fail }: { fail: FailedItem }) => {
  const [activeTab, setActiveTab] = useState<"visual" | "scraped" | "error" | "dto">("visual");

  const flatErrors =
    typeof fail.error === "object" && fail.error !== null
      ? flattenErrorObject(fail.error)
      : { "": String(fail.error) };

  return (
    <div className="bg-slate-950 border border-rose-950/40 rounded-xl p-4 space-y-4 shadow-lg shadow-rose-950/5 text-left font-sans">
      {/* Index and Header */}
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center border-b border-rose-950/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-rose-950/40 text-rose-400 border border-rose-900/40 text-xs px-2 py-0.5 rounded font-mono font-bold">
            Index {fail.index}
          </span>
          <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">
            Validation Failed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-900 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all cursor-pointer ${
            activeTab === "visual"
              ? "bg-rose-900/80 text-white shadow-md shadow-rose-900/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.39 2.007a7.5 7.5 0 00-9.235 9.235 5.25 5.25 0 009.236-9.236zM15 11a5 5 0 11-10 0 5 5 0 0110 0z"
              clipRule="evenodd"
            />
          </svg>
          Visual Debugger
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("scraped")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all cursor-pointer ${
            activeTab === "scraped"
              ? "bg-rose-900/80 text-white shadow-md shadow-rose-900/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Scraped Specs Table
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("error")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all cursor-pointer ${
            activeTab === "error"
              ? "bg-rose-900/80 text-white shadow-md shadow-rose-900/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Raw Error JSON
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dto")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dto"
              ? "bg-rose-900/80 text-white shadow-md shadow-rose-900/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 3.293a1 1 0 011.414 0L9 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Raw Parsed DTO
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "visual" && (
          <div className="space-y-4">
            {fail.parsed ? (
              <DTOVisualizer data={fail.parsed} mappings={fail.mappings} errors={flatErrors} />
            ) : (
              <div className="text-slate-500 italic text-xs py-4 text-center">
                No parsed DTO data returned due to runtime mapping crash. Check the Error JSON tab.
              </div>
            )}
          </div>
        )}

        {activeTab === "scraped" && (
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-[11px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-2.5">Raw Scraped Key</th>
                  <th className="p-2.5">Scraped Value</th>
                  <th className="p-2.5">Mapped to DTO Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-slate-950/20 font-sans">
                {Object.entries(fail.raw).map(([k, v]) => {
                  const dtoPath = findMappedDTOPath(k, fail.mappings);
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
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "error" && (
          <pre className="text-rose-300 text-[11px] whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-[400px] overflow-y-auto leading-relaxed font-mono">
            {JSON.stringify(fail.error, null, 2)}
          </pre>
        )}

        {activeTab === "dto" && (
          <pre className="text-slate-300 text-[11px] whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-[400px] overflow-y-auto leading-relaxed font-mono">
            {JSON.stringify(fail.parsed || {}, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
