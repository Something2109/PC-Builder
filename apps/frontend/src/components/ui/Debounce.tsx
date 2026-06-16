import { useRef } from "react";

export default function useDebounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
) {
  const Timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  return (...args: Parameters<T>) => {
    clearTimeout(Timeout.current);
    Timeout.current = setTimeout(() => func(...args), delay);
  };
}
