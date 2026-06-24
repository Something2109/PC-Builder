"use client";

import React, { useState } from "react";
import { CodeEditor } from "@/components/ui/CodeEditor";

export interface JsonInputEditorProps {
  value: Record<string, unknown>;
  onChange: (newValue: Record<string, unknown>) => void;
  onError: (errorMsg: string | null) => void;
}

export default function JsonInputEditor({ value, onChange, onError }: JsonInputEditorProps) {
  const [prevValue, setPrevValue] = useState<Record<string, unknown>>(value);
  const [text, setText] = useState<string>(() => JSON.stringify(value, null, 2));

  // Sync internal text state with external changes during rendering (avoiding useEffect)
  if (value !== prevValue) {
    setPrevValue(value);
    try {
      let shouldSync = true;
      if (text.trim()) {
        const parsedCurrent = JSON.parse(text);
        // Compare parsed values to avoid resetting while typing valid characters
        if (JSON.stringify(parsedCurrent) === JSON.stringify(value)) {
          shouldSync = false;
        }
      }
      if (shouldSync) {
        setText(JSON.stringify(value, null, 2));
      }
    } catch {
      // If current text is invalid, but value changed from outside, we reset it
      setText(JSON.stringify(value, null, 2));
    }
  }

  const handleTextChange = (newVal: string) => {
    setText(newVal);
    try {
      if (newVal.trim()) {
        const parsed = JSON.parse(newVal);
        onChange(parsed);
      } else {
        onChange({});
      }
      onError(null);
    } catch (err: unknown) {
      const parseErr = err as Error;
      onError(`JSON Parse Warning: ${parseErr.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <CodeEditor
        rows={15}
        value={text}
        onChange={handleTextChange}
        placeholder="Paste raw spec JSON here..."
      />
    </div>
  );
}
