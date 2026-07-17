"use client";

import { ArticleStatus } from "@pc-builder/shared/article";
import { useRouter } from "next/navigation";
import React from "react";

import { RowWrapper } from "@/ui/FlexWrapper";

interface SubmitBarProps {
  title: string;
  isNew: boolean;
  isSaving: boolean;
  onDelete?: () => void;
  onSubmit: (status: ArticleStatus) => void;
}

export function SubmitBar({ title, isNew, isSaving, onDelete, onSubmit }: SubmitBarProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
      <div className="max-w-xl mx-auto bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl px-5 py-3.5 flex items-center justify-between gap-4 text-white">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {isNew ? "Create mode" : "Edit mode"}
          </span>
          <span className="text-xs font-semibold text-slate-200 max-w-30 truncate">
            {title || "Untitled"}
          </span>
        </div>

        <RowWrapper className="items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>

          {!isNew && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isSaving}
              className="py-1.5 px-3 border border-red-800 text-red-400 hover:bg-red-950/20 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={() => onSubmit(ArticleStatus.Draft)}
            disabled={isSaving}
            className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={() => onSubmit(ArticleStatus.Published)}
            disabled={isSaving}
            className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Publishing..." : isNew ? "Publish" : "Update"}
          </button>
        </RowWrapper>
      </div>
    </div>
  );
}
