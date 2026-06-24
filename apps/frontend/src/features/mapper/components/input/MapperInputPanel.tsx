"use client";

import { Products } from "@pc-builder/shared/part";
import React, { useState } from "react";

import { SAMPLE_TEMPLATES } from "../../constants";
import { FormInputsEditor } from "./editor/FormInputsEditor";
import JsonInputEditor from "./editor/JsonInputEditor";

export interface MapperInputPanelProps {
  onSubmit: (data: { productType: Products; fallbackBrand: string; jsonInput: string }) => void;
  loading: boolean;
  error: string | null;
}

enum FormInputMode {
  FORM = "form",
  JSON = "json",
}

const FormInputLabels: Record<FormInputMode, string> = {
  [FormInputMode.FORM]: "Form Inputs",
  [FormInputMode.JSON]: "Raw JSON",
};

export default function MapperInputPanel({ onSubmit, loading, error }: MapperInputPanelProps) {
  const [productType, setProductType] = useState<Products>(Products.MAIN);
  const [fallbackBrand, setFallbackBrand] = useState<string>("");

  // Input mode: bi-directional JSON & Form modes
  const [inputMode, setInputMode] = useState<FormInputMode>(FormInputMode.FORM);

  // Single source of truth state for specs data (object representation)
  const [specs, setSpecs] = useState<Record<string, unknown>>(SAMPLE_TEMPLATES[productType] ?? {});

  const [localError, setLocalError] = useState<string | null>(null);

  const handleTabSwitch = (newMode: FormInputMode) => {
    if (inputMode === FormInputMode.JSON && newMode === FormInputMode.FORM) {
      if (localError) {
        // If there's an active parsing error, block switching back to form mode
        return;
      }
    }
    setLocalError(null);
    setInputMode(newMode);
  };

  const handleProductTypeChange = (newType: Products) => {
    setProductType(newType);
    const templateObj = SAMPLE_TEMPLATES[newType] || {};
    setSpecs(templateObj);
    setLocalError(null);
  };

  const handleResetTemplate = () => {
    const templateObj = SAMPLE_TEMPLATES[productType] || {};
    setSpecs(templateObj);
    setLocalError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localError) {
      return; // Block submit if malformed JSON is active
    }

    onSubmit({
      productType,
      fallbackBrand,
      jsonInput: JSON.stringify(specs, null, 2),
    });
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleFormSubmit} className="lg:col-span-5 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Selector */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Product Type
          </label>
          <select
            value={productType}
            onChange={(e) => handleProductTypeChange(e.target.value as Products)}
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

      {/* Input Panel Header & Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-1 border border-slate-800 bg-slate-950/60 p-1 rounded-lg">
            {Object.values(FormInputMode).map((val) => (
              <button
                type="button"
                key={`mapper-form-tab-${val}`}
                onClick={() => handleTabSwitch(val)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  inputMode === val ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {FormInputLabels[val]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleResetTemplate}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-bold hover:underline"
          >
            Reset to Template
          </button>
        </div>

        {/* Input Panels */}
        {inputMode === "form" ? (
          <FormInputsEditor value={specs} onChange={setSpecs} />
        ) : (
          <JsonInputEditor value={specs} onChange={setSpecs} onError={setLocalError} />
        )}
      </div>

      {displayError && (
        <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
          <strong>Error:</strong> {displayError}
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
  );
}
