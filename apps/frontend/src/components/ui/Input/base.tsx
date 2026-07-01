import { ChangeEvent, InputEvent } from "react";

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

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type TransformedChangeEvent<
  T,
  Element extends InputElement = HTMLInputElement,
> = ChangeEvent<Omit<Element, "value" | "defaultValue"> & { value?: T; defaultValue?: T }>;

export type TransformedInputEvent<T, Element extends InputElement = HTMLInputElement> = InputEvent<
  Omit<Element, "value" | "defaultValue"> & { value?: T; defaultValue?: T }
>;

export function transformEvent<T, Element extends InputElement = HTMLInputElement>(
  e: ChangeEvent<Element>,
  transform: (value: string) => T
): TransformedChangeEvent<T, Element>;

export function transformEvent<T, Element extends InputElement = HTMLInputElement>(
  e: InputEvent<Element>,
  transform: (value: string) => T
): TransformedInputEvent<T, Element>;

export function transformEvent<T, Element extends InputElement = HTMLInputElement>(
  e: ChangeEvent<Element> | InputEvent<Element>,
  transform: (value: string) => T
): TransformedChangeEvent<T, Element> | TransformedInputEvent<T, Element> {
  // Clone target and currentTarget references safely
  const customTarget = Object.create(e.target, {
    value: {
      get: () => transform((e.target as InputElement).value),
      enumerable: true,
      configurable: true,
    },
  });

  const customCurrentTarget = Object.create(e.currentTarget, {
    value: {
      get: () => transform(e.currentTarget.value),
      enumerable: true,
      configurable: true,
    },
  });

  // Reassemble the event object safely without breaking React's prototype chain
  const transformedEvent = Object.create(e, {
    target: { value: customTarget, enumerable: true },
    currentTarget: { value: customCurrentTarget, enumerable: true },
  });

  return transformedEvent as TransformedChangeEvent<T, Element>;
}
