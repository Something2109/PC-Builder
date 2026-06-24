import React from "react";

import { MappingTrace } from "../../types";
import { findMappedDTOPath } from "../../utils";

interface MapperResultScrapedTabProps {
  raw: Record<string, unknown>;
  mappings?: MappingTrace;
}

export function MapperResultScrapedTab({ raw, mappings }: MapperResultScrapedTabProps) {
  if (!raw || Object.keys(raw).length === 0) {
    return (
      <div className="p-3 text-center text-slate-500 italic font-mono text-xs">
        No raw specs available.
      </div>
    );
  }

  return (
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
          {Object.entries(raw).map(([k, v]) => {
            const dtoPath = findMappedDTOPath(k, mappings);
            return (
              <tr key={k} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-2.5 font-mono text-slate-300 font-bold break-all max-w-37.5">
                  {k}
                </td>
                <td className="p-2.5 text-slate-400 break-all whitespace-pre-wrap max-h-40 overflow-y-auto max-w-75">
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
  );
}
