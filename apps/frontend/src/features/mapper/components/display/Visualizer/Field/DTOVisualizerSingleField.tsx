import React from "react";
import { MappingTrace } from "../../../../types";
import { getErrorAtPath, findSourceRawKey } from "../../../../utils";

interface DTOVisualizerSingleFieldProps {
  fieldKey: string;
  val: unknown;
  mappings?: MappingTrace;
  errors?: Record<string, string>;
  onlyErrors?: boolean;
}

export function DTOVisualizerSingleField({
  fieldKey,
  val,
  mappings,
  errors,
  onlyErrors = false,
}: DTOVisualizerSingleFieldProps) {
  if (typeof val === "object" && val !== null) {
    const subKeys = new Set<string>([
      ...Object.keys(val),
      ...(errors
        ? Object.keys(errors)
            .filter((k) => (fieldKey ? k.startsWith(`${fieldKey}.`) : !k.includes(".")))
            .map((k) => (fieldKey ? k.substring(fieldKey.length + 1).split(".")[0] : k))
            .filter(Boolean)
        : []),
    ]);

    const activeSubKeys = onlyErrors
      ? Array.from(subKeys).filter(
          (subKey) => errors && getErrorAtPath(errors, fieldKey ? `${fieldKey}.${subKey}` : subKey)
        )
      : Array.from(subKeys);

    return (
      <div className="bg-slate-955/80 border border-slate-800/50 p-3 rounded-lg grid grid-cols-1 gap-3">
        {activeSubKeys.map((subKey) => {
          const subVal = (val as Record<string, unknown>)[subKey];
          const subPath = fieldKey ? `${fieldKey}.${subKey}` : subKey;
          const errorMsg = errors ? getErrorAtPath(errors, subPath) : undefined;
          const source = mappings ? findSourceRawKey(subPath, mappings) : null;
          return (
            <div
              key={subKey}
              className={`flex flex-col gap-1.5 p-2 rounded-md border ${
                errorMsg
                  ? "bg-rose-955/20 border-rose-900/40"
                  : "bg-slate-900/40 border-slate-800/20"
              }`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] text-slate-500 font-medium uppercase">
                  {subKey.replace("_", " ")}
                </span>
                {source && (
                  <span
                    className="text-[8px] bg-slate-955 text-slate-500 border border-slate-855 px-1 py-0.2 rounded font-mono truncate max-w-30"
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
                  <svg className="w-3.5 h-3.5 fill-rose-400 shrink-0 mt-0.5" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="wrap-break-word whitespace-normal leading-relaxed">
                    {errorMsg}
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (val === undefined) {
    return (
      <div className="bg-rose-955/10 border border-rose-900/30 p-3 rounded-lg text-rose-300 italic text-xs">
        Field was not parsed/extracted from raw specs
      </div>
    );
  }

  return <span className="text-slate-300">{String(val)}</span>;
}
