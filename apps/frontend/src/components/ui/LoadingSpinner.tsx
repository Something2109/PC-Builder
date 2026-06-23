"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";

import { mergeClass } from "./mergeClass";

export function LoadingSpinner({
  text,
  className,
  ...rest
}: {
  text?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      className={mergeClass(
        "w-full py-6 flex items-center justify-center gap-3 text-xs font-bold text-accent-indigo animate-pulse",
        className
      )}
      {...rest}
    >
      <svg className="animate-spin h-4 w-4 text-accent-indigo" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span>{text.toUpperCase()}</span>}
    </div>
  );
}

export default LoadingSpinner;
