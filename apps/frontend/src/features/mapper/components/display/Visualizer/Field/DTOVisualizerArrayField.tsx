import React from "react";
import { MappingTrace } from "../../../../types";
import { hasErrorInSubtree } from "../../../../utils";
import { DTOVisualizerSingleField } from "./DTOVisualizerSingleField";

interface DTOVisualizerArrayFieldProps {
  fieldKey: string;
  val: unknown[];
  mappings?: MappingTrace;
  errors?: Record<string, string>;
  onlyErrors?: boolean;
}

export function DTOVisualizerArrayField({
  fieldKey,
  val,
  mappings,
  errors,
  onlyErrors = false,
}: DTOVisualizerArrayFieldProps) {
  return (
    <div className="space-y-3">
      {val.map((item, idx) => {
        const itemPath = `${fieldKey}.${idx}`;
        const itemHasError = errors ? hasErrorInSubtree(errors, itemPath) : false;

        // If we only want errors and this array item has no errors, skip rendering it
        if (onlyErrors && !itemHasError) return null;

        return (
          <div
            key={idx}
            className={`p-3 rounded-lg flex flex-col gap-3 border transition-all ${
              itemHasError
                ? "bg-rose-955/10 border-rose-900/30"
                : "bg-slate-955/80 border-slate-800/50"
            }`}
          >
            <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                Item #{idx + 1}
              </span>
            </div>

            <DTOVisualizerSingleField
              fieldKey={itemPath}
              val={item}
              mappings={mappings}
              errors={errors}
              onlyErrors={onlyErrors}
            />
          </div>
        );
      })}
    </div>
  );
}
