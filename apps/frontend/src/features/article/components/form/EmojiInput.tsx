"use client";

import React, { useState } from "react";

const PRESET_EMOJIS = [
  "📝",
  "💻",
  "⚙️",
  "🚀",
  "💡",
  "🔧",
  "📦",
  "🔋",
  "🖥️",
  "📁",
  "📖",
  "🎨",
  "🛠️",
  "🔌",
  "📊",
  "🔥",
  "✨",
  "🧠",
];

interface EmojiInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function EmojiInput({ value, onChange }: EmojiInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="absolute -bottom-10 left-8 md:left-12 z-10">
      {value ? (
        <div
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex items-center justify-center text-5xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 rounded-full w-20 h-20 shadow-lg cursor-pointer hover:rotate-6 hover:scale-105 transition-all select-none"
          title="Change icon"
        >
          {value}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex items-center justify-center text-xs font-semibold bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-md hover:bg-slate-50 cursor-pointer"
        >
          😀 Add Icon
        </button>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-24 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl z-20 w-64 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Emoji
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="text-2xl hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(undefined);
                  setShowEmojiPicker(false);
                }}
                className="grow text-center py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[10px] rounded-lg transition-colors"
              >
                Remove Icon
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="grow text-center py-1.5 hover:bg-slate-100 text-slate-400 font-medium text-[10px] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
