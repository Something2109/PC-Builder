"use client";

import { useValidation } from "@/features/build/hooks/Validation";

export default function BuildResultList() {
  const {
    result: { rules },
  } = useValidation();

  // If rules is empty, validation hasn't run yet
  if (Object.keys(rules).length === 0) {
    return (
      <div className="text-xs text-text/50 text-center py-4 bg-slate-50/5 rounded-xl border border-dashed border-border/80">
        Click <strong className="text-accent-indigo">Check</strong> above to verify component compatibility.
      </div>
    );
  }

  const errors = Object.entries(rules)
    .filter(([, val]) => val.error)
    .map(([name, val]) => ({ name, error: val.error }));

  // If no errors, build is compatible!
  if (errors.length === 0) {
    return (
      <div className="rounded-xl border border-mint/20 bg-mint/10 p-4 text-mint flex gap-3 items-start">
        <svg className="size-5 shrink-0 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold">Fully Compatible!</h4>
          <p className="text-[11px] text-mint/80">All active compatibility checks passed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Alert Header */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500 flex gap-3 items-start">
        <svg className="size-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold">{errors.length} Issue{errors.length > 1 ? "s" : ""} Found</h4>
          <p className="text-[11px] text-red-500/80">Compatibility checks failed. Review issues below.</p>
        </div>
      </div>

      {/* Scrollable Error Cards */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {errors.map(({ name, error }) => (
          <div key={`Rule-${name}`} className="p-3 rounded-xl border border-border bg-slate-50/5 text-xs space-y-1">
            <span className="font-bold text-text block leading-tight">{name}</span>
            <span className="text-text/60 block leading-normal">{error}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
