import React from "react";
import { MappingTrace } from "../../../types";
import Part from "@pc-builder/shared/part";
import { DTOVisualizerSingleField } from "./Field/DTOVisualizerSingleField";
import { DTOVisualizerArrayField } from "./Field/DTOVisualizerArrayField";
import { hasErrorInSubtree } from "@/features/mapper";
import { VerticalCollapsible } from "@/components/ui/Collapsible";

const basicFields = Part.BasicAttributes.options.filter((val) => !["id"].includes(val));

export const DTOVisualizerVisual = ({
  data,
  mappings,
  errors,
  onlyErrors = false,
}: {
  data: Record<string, unknown>;
  mappings?: MappingTrace;
  errors?: Record<string, string>;
  onlyErrors?: boolean;
}) => {
  // Filter basic fields if onlyErrors is true
  const activeBasicFields = onlyErrors
    ? basicFields.filter((key) => errors && errors[key] !== undefined)
    : basicFields;

  // Construct basic info object
  const basicInfoObj = activeBasicFields.reduce(
    (acc, key) => {
      if (data[key] !== undefined) {
        acc[key] = data[key];
      }
      return acc;
    },
    {} as Record<string, unknown>
  );

  const detailedInfoKeys = new Set<string>([
    ...Object.keys(data).filter((key) => !basicFields.includes(key as Part.BasicAttributes)),
    ...(errors
      ? Object.keys(errors)
          .map((k) => k.split(".")[0])
          .filter((k) => k && !basicFields.includes(k as Part.BasicAttributes))
      : []),
  ]);

  // Filter detailed keys if onlyErrors is true
  const activeDetailedKeys = onlyErrors
    ? Array.from(detailedInfoKeys).filter(
        (key) => errors && Object.keys(errors).some((k) => k === key || k.startsWith(`${key}.`))
      )
    : Array.from(detailedInfoKeys);

  const detailedInfo: [string, unknown][] = activeDetailedKeys.map((key) => [key, data[key]]);

  return (
    <div className="space-y-4 text-xs">
      {Object.keys(basicInfoObj).length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Basic Information
          </h3>
          <DTOVisualizerSingleField
            fieldKey=""
            val={basicInfoObj}
            mappings={mappings}
            errors={errors}
            onlyErrors={onlyErrors}
          />
        </div>
      )}
      {detailedInfo.map(([key, val]) => {
        const hasError = errors ? hasErrorInSubtree(errors, key) : false;
        return (
          <VerticalCollapsible
            key={key}
            className={`border rounded-xl p-4 space-y-3 transition-all ${
              hasError
                ? "bg-rose-955/5 border-rose-900/50 shadow-md shadow-rose-955/2"
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
              <DTOVisualizerArrayField
                fieldKey={key}
                val={val}
                mappings={mappings}
                errors={errors}
                onlyErrors={onlyErrors}
              />
            ) : (
              <DTOVisualizerSingleField
                fieldKey={key}
                val={val}
                mappings={mappings}
                errors={errors}
                onlyErrors={onlyErrors}
              />
            )}
          </VerticalCollapsible>
        );
      })}
    </div>
  );
};
