import React from "react";

import { Section as SectionType } from "@/utils/article";

import { ContentProps } from "../utils";

export function Section({
  content,
  prefix,
  children,
}: ContentProps<SectionType> & { children: React.ReactNode }) {
  return (
    <section id={content.id} className="flex flex-col gap-3 w-full my-6 scroll-mt-24">
      <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        {prefix && (
          <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-lg text-lg select-none">
            {prefix}
          </span>
        )}
        <span>{content.title}</span>
      </h2>
      <div className="pl-4 md:pl-6 border-l border-slate-100 dark:border-slate-800 space-y-2">
        {children}
      </div>
    </section>
  );
}
