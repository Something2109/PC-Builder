"use client";

import { useBuildContext } from "@/features/build/hooks/BuildContext";
import { useValidation } from "@/features/build/hooks/Validation";

export default function BuildValidateForm() {
  const { list } = useBuildContext();
  const { validate, pending } = useValidation();

  return (
    <form action={() => validate(list)}>
      {pending ? (
        <div className="flex items-center gap-2 text-xs text-text/60 font-bold">
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
          <span>Checking...</span>
        </div>
      ) : (
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-bold text-white bg-accent-indigo hover:bg-accent-indigo/90 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
        >
          Check
        </button>
      )}
    </form>
  );
}
