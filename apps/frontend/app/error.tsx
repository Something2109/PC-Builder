"use client";

import ErrorPanel from "@/ui/ErrorPanel";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPanel
      className="h-[70vh]"
      text="Something went wrong!"
      reset={reset}
    />
  );
}
