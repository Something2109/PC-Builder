"use client";

interface ErrorBannerProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="bg-rose-950/50 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-rose-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{error}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-rose-400 hover:text-white font-bold px-2 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
