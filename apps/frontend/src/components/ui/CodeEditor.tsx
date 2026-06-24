import React from "react";

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  rows = 15,
  placeholder,
  className = "",
}: CodeEditorProps) {
  return (
    <textarea
      readOnly={readOnly}
      rows={rows}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      className={`font-mono bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-y leading-relaxed w-full ${
        readOnly ? "cursor-default select-text focus:ring-0 focus:border-slate-800" : ""
      } ${className}`}
    />
  );
}
