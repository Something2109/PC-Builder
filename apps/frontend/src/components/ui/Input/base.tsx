import { ChangeEvent } from "react";

export const defaultStyle =
  "only:w-full px-3.5 py-1.5 text-sm bg-card/45 dark:bg-card/25 backdrop-blur-sm border border-border/80 dark:border-border/60 rounded-xl transition-all duration-200 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/15 hover:border-accent-indigo/60 text-text placeholder-text/35 disabled:opacity-50 disabled:cursor-not-allowed";

export const rangeDivStyle = "relative hidden md:block flex-1 self-stretch";
export const rangeInputStyle = "absolute w-full top-1/2 -translate-y-1/2 first:bg-range-input";

// Intercepts the default onChange event and proxies its target value
// to return undefined instead of empty string.
export function cleanEvent<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  e: ChangeEvent<T>,
  onChange?: (e: ChangeEvent<T>) => void
) {
  if (!onChange) return;
  const proxyTarget = new Proxy(e.target, {
    get(target, prop) {
      if (prop === "value") {
        return target.value || undefined;
      }
      const value = Reflect.get(target, prop);
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    },
    set(target, prop, value) {
      return Reflect.set(target, prop, value);
    },
  });
  const proxyEvent = new Proxy(e, {
    get(target, prop) {
      if (prop === "target" || prop === "currentTarget") {
        return proxyTarget;
      }
      const value = Reflect.get(target, prop);
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    },
  });
  onChange(proxyEvent);
}
