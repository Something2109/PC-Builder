"use client";

import React, { useState, useRef } from "react";

import { useImageUpload } from "@/hooks/useImageUpload";

const PRESET_COVERS = [
  "linear-gradient(to right, #8b5cf6, #6366f1)", // Indigo Purple
  "linear-gradient(to right, #f97316, #ec4899)", // Pink Sunset
  "linear-gradient(to right, #14b8a6, #10b981)", // Green Teal
  "linear-gradient(to right, #475569, #1e293b)", // Steel Dark
  "linear-gradient(to right, #f59e0b, #e11d48)", // Sunfire
];

interface CoverInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function CoverInput({ value, onChange }: CoverInputProps) {
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const { upload: uploadCover, isUploading: isCoverUploading } = useImageUpload();
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetCover = (preset: string) => {
    onChange(preset);
    setShowCoverSelector(false);
  };

  const handleCustomCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadCover(file, "covers");
      onChange(url);
      setShowCoverSelector(false);
    } catch (err) {
      console.error("Failed to upload cover:", err);
      alert("Cover image upload failed.");
    }
  };

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner group relative">
      {value ? (
        value.startsWith("linear-gradient") ? (
          <div className="w-full h-full" style={{ background: value }} />
        ) : (
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
        )
      ) : (
        <div className="w-full h-full bg-slate-100/50 dark:bg-slate-950/20 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <span className="text-xs text-slate-400">No cover image</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 backdrop-blur-[1px]">
        <button
          type="button"
          onClick={() => setShowCoverSelector(!showCoverSelector)}
          className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
        >
          Change Cover
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
          >
            Remove Cover
          </button>
        )}
      </div>

      {showCoverSelector && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-20">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 max-w-sm w-full space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Choose Cover Layout
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetCover(preset)}
                  className="h-10 rounded-lg shadow-sm border border-black/10"
                  style={{ background: preset }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="file"
                accept="image/*"
                ref={coverFileInputRef}
                className="hidden"
                onChange={handleCustomCover}
              />
              <button
                type="button"
                disabled={isCoverUploading}
                onClick={() => coverFileInputRef.current?.click()}
                className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                {isCoverUploading ? "Uploading cover..." : "Upload custom photo"}
              </button>
              <button
                type="button"
                onClick={() => setShowCoverSelector(false)}
                className="w-full text-center py-2 hover:bg-slate-100 text-slate-500 font-medium text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
