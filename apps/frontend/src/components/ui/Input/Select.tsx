"use client";

import { useId, useMemo, useState } from "react";

import { mergeClass } from "../mergeClass";
import DropdownWrapper from "./DropdownWrapper";

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionType = string | number;
type OptionWithLabelType = {
  label: string;
  value: OptionType;
};
type OptionListType = (string | number | OptionWithLabelType)[];
type SelectOptionsType = OptionListType | Record<string, OptionListType>;

export interface SelectProps {
  name?: string;
  label?: string;
  labelHtmlFor?: string;
  defaultValue?: string | number | (string | number)[];
  value?: string | number | (string | number)[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  id?: string;
  // Pass-through for anything else callers already use (title, etc.)
  [key: string]: unknown;
}

export interface OptionSelectProps extends SelectProps {
  options: SelectOptionsType;
  /** React 19 plain ref — still typed as HTMLSelectElement for backward compat */
  ref?: React.Ref<HTMLSelectElement>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flatOptions(options: OptionListType): Array<{ value: string; label: string }> {
  return options.map((o) => {
    if (o !== null && typeof o === "object" && "label" in o && "value" in o) {
      return { value: String(o.value), label: String(o.label) };
    }
    return { value: String(o), label: String(o) };
  });
}

// ─── OptionSelect ─────────────────────────────────────────────────────────────
// A custom-styled dropdown that wraps a hidden native <select> for full form
// compatibility: ref forwarding, required validation, name, and form submission.

export function OptionSelect({
  options,
  required,
  disabled,
  defaultValue = "",
  value: controlledValue,
  onChange,
  placeholder,
  label,
  labelHtmlFor,
  name,
  className,
  id,
  ref,
  multiple,
  ...rest
}: OptionSelectProps) {
  const uid = useId();
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = useMemo(() => {
    if (multiple) {
      if (Array.isArray(defaultValue)) {
        return defaultValue.map(String);
      }
      return defaultValue ? [String(defaultValue)] : [];
    }
    return String(defaultValue ?? "");
  }, [defaultValue, multiple]);

  const [prevDefault, setPrevDefault] = useState(normalizedDefault);
  const [internalValue, setInternalValue] = useState(normalizedDefault);

  const isSame = multiple
    ? Array.isArray(normalizedDefault) &&
      Array.isArray(prevDefault) &&
      normalizedDefault.length === prevDefault.length &&
      normalizedDefault.every((v, i) => v === prevDefault[i])
    : normalizedDefault === prevDefault;

  if (!isSame) {
    setPrevDefault(normalizedDefault);
    setInternalValue(normalizedDefault);
  }

  const rawValue = isControlled ? controlledValue : internalValue;
  const value = useMemo(() => {
    if (multiple) {
      if (Array.isArray(rawValue)) {
        return rawValue.map(String);
      }
      return rawValue ? [String(rawValue)] : [];
    }
    return String(rawValue ?? "");
  }, [rawValue, multiple]);

  const [isOpen, setIsOpen] = useState(false);

  const resolved = useMemo(() => {
    if (Array.isArray(options)) {
      const flatList = flatOptions(options);
      return { isGrouped: false, flat: flatList, groups: null };
    } else {
      const groups = Object.entries(options).map(([group, list]) => ({
        group,
        items: flatOptions(list),
      }));
      const flatList = groups.flatMap((g) => g.items.map((o) => ({ ...o, group: g.group })));
      return { isGrouped: true, flat: flatList, groups };
    }
  }, [options]);

  const { flat, isGrouped, groups } = resolved;

  const displayLabel = useMemo(() => {
    if (Array.isArray(value)) {
      const selectedLabels = value
        .map((val) => flat.find((o) => o.value === val)?.label || val)
        .filter(Boolean);
      if (selectedLabels.length > 0) {
        return selectedLabels.join(", ");
      }
      return placeholder || (required ? "Select..." : "None");
    } else {
      return (
        flat.find((o) => o.value === value)?.label ||
        value ||
        placeholder ||
        (required ? "Select..." : "None")
      );
    }
  }, [flat, value, placeholder, required]);

  const inputId = id ?? labelHtmlFor ?? name ?? uid;

  const commit = (val: string) => {
    let newValue: string | string[];
    if (multiple) {
      if (val === "") {
        newValue = [];
      } else {
        const currentValues = Array.isArray(value) ? value : value ? [value] : [];
        if (currentValues.includes(val)) {
          newValue = currentValues.filter((v) => v !== val);
        } else {
          newValue = [...currentValues, val];
        }
      }
    } else {
      newValue = val;
      setIsOpen(false);
    }

    if (!isControlled) setInternalValue(newValue);

    // Fire a synthetic onChange event so existing handlers keep working unchanged
    if (onChange) {
      const nativeSelect = document.getElementById(`${inputId}-native`) as HTMLSelectElement | null;
      if (nativeSelect) {
        if (multiple) {
          const optionValues = Array.isArray(newValue) ? newValue : [newValue];
          Array.from(nativeSelect.options).forEach((opt) => {
            opt.selected = optionValues.includes(opt.value);
          });
        } else {
          nativeSelect.value = val;
        }
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  const isSelected = (val: string) => {
    if (Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  return (
    <DropdownWrapper
      label={label}
      labelHtmlFor={inputId}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={className}
      trigger={
        <>
          {/* Hidden native <select> — carries the real value for form submission,
              ref forwarding, and required validation */}
          <select
            ref={ref}
            id={`${inputId}-native`}
            name={name}
            required={required}
            disabled={disabled}
            multiple={multiple}
            value={value}
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              if (multiple) {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (opt) => opt.value
                );
                if (!isControlled) setInternalValue(selectedOptions);
                onChange?.(e);
              } else {
                if (!isControlled) setInternalValue(e.target.value);
                onChange?.(e);
              }
            }}
            className="sr-only"
            {...rest}
          >
            {!multiple && !required && <option value="">None</option>}
            {flat.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Visible custom trigger button */}
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={mergeClass(
              "w-full text-left bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl pl-4 pr-10 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 disabled:opacity-50 disabled:cursor-not-allowed",
              (Array.isArray(value) ? value.length > 0 : value) ? "text-text" : "text-text/40"
            )}
          >
            {displayLabel}
          </button>

          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className={mergeClass(
                "w-4 h-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            >
              <path
                d="M7 9l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </>
      }
    >
      {/* None option */}
      {!required && (
        <button
          key={`${uid}-none`}
          type="button"
          onClick={() => commit("")}
          className={mergeClass(
            "w-full px-3 py-2 rounded-lg text-left text-sm text-text/40 hover:bg-white/5 transition",
            (Array.isArray(value) ? value.length === 0 : value === "") ? "bg-white/5 text-text" : ""
          )}
        >
          {multiple ? "Clear All" : "None"}
        </button>
      )}

      {/* Flat or grouped options */}
      {!isGrouped
        ? flat.map((o) => (
            <button
              key={`${uid}-${o.value}`}
              type="button"
              onClick={() => commit(o.value)}
              className={mergeClass(
                "w-full px-3 py-2 rounded-lg text-left text-sm text-text/80 hover:bg-white/5 transition",
                isSelected(o.value) ? "bg-white/5 text-text font-medium" : ""
              )}
            >
              {o.label}
            </button>
          ))
        : groups!.map(({ group, items }) => (
            <div key={`${uid}-group-${group}`}>
              <div className="px-3 pt-2 pb-1 text-xs font-bold text-text/40 uppercase tracking-wider">
                {group}
              </div>
              {items.map((o) => (
                <button
                  key={`${uid}-${group}-${o.value}`}
                  type="button"
                  onClick={() => commit(o.value)}
                  className={mergeClass(
                    "w-full px-3 py-2 rounded-lg text-left text-sm text-text/80 hover:bg-white/5 transition",
                    isSelected(o.value) ? "bg-white/5 text-text font-medium" : ""
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          ))}
    </DropdownWrapper>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
// Bare custom select — pass children as option buttons yourself.

export function Select({
  name,
  label,
  labelHtmlFor,
  defaultValue = "",
  value: controlledValue,
  onChange,
  placeholder,
  required,
  disabled,
  multiple,
  className,
  id,
  children,
}: SelectProps & { children?: React.ReactNode }) {
  const uid = useId();
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = useMemo(() => {
    if (multiple) {
      if (Array.isArray(defaultValue)) {
        return defaultValue.map(String);
      }
      return defaultValue ? [String(defaultValue)] : [];
    }
    return String(defaultValue ?? "");
  }, [defaultValue, multiple]);

  const [prevDefault, setPrevDefault] = useState(normalizedDefault);
  const [internalValue, setInternalValue] = useState(normalizedDefault);

  const isSame = multiple
    ? Array.isArray(normalizedDefault) &&
      Array.isArray(prevDefault) &&
      normalizedDefault.length === prevDefault.length &&
      normalizedDefault.every((v, i) => v === prevDefault[i])
    : normalizedDefault === prevDefault;

  if (!isSame) {
    setPrevDefault(normalizedDefault);
    setInternalValue(normalizedDefault);
  }

  const rawValue = isControlled ? controlledValue : internalValue;
  const value = useMemo(() => {
    if (multiple) {
      if (Array.isArray(rawValue)) {
        return rawValue.map(String);
      }
      return rawValue ? [String(rawValue)] : [];
    }
    return String(rawValue ?? "");
  }, [rawValue, multiple]);

  const [isOpen, setIsOpen] = useState(false);
  const inputId = id ?? labelHtmlFor ?? name ?? uid;

  return (
    <DropdownWrapper
      label={label}
      labelHtmlFor={inputId}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className={className}
      trigger={
        <>
          {name && (
            <select
              name={name}
              required={required}
              disabled={disabled}
              multiple={multiple}
              value={value}
              aria-hidden="true"
              tabIndex={-1}
              onChange={(e) => {
                if (multiple) {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(
                    (opt) => opt.value
                  );
                  if (!isControlled) setInternalValue(selectedOptions);
                  onChange?.(e);
                } else {
                  if (!isControlled) setInternalValue(e.target.value);
                  onChange?.(e);
                }
              }}
              className="sr-only"
            >
              {!multiple && !required && <option value="">None</option>}
            </select>
          )}
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={mergeClass(
              "w-full text-left bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl pl-4 pr-10 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 disabled:opacity-50 disabled:cursor-not-allowed",
              (Array.isArray(value) ? value.length > 0 : value) ? "text-text" : "text-text/40"
            )}
          >
            {Array.isArray(value)
              ? value.join(", ") || placeholder || (required ? "Select..." : "None")
              : value || placeholder || (required ? "Select..." : "None")}
          </button>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className={mergeClass(
                "w-4 h-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            >
              <path
                d="M7 9l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </>
      }
    >
      {children}
    </DropdownWrapper>
  );
}
