import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounceValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceFunction(delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return useCallback(
    <Arg extends unknown[]>(func: (...arg: Arg) => void, ...arg: Arg) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => func(...arg), delay);
    },
    [delay]
  );
}
