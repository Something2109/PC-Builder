"use client";

import { useId, useState } from "react";

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
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
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

function allOptions(
  options: SelectOptionsType
): Array<{ value: string; label: string; group?: string }> {
  if (Array.isArray(options)) return flatOptions(options);
  return Object.entries(options).flatMap(([group, list]) =>
    flatOptions(list).map((o) => ({ ...o, group }))
  );
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
  ...rest
}: OptionSelectProps) {
  const uid = useId();
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = String(defaultValue ?? "");
  const [prevDefault, setPrevDefault] = useState(normalizedDefault);
  const [internalValue, setInternalValue] = useState(normalizedDefault);

  if (normalizedDefault !== prevDefault) {
    setPrevDefault(normalizedDefault);
    setInternalValue(normalizedDefault);
  }

  const value = isControlled ? String(controlledValue) : internalValue;
  const [isOpen, setIsOpen] = useState(false);

  const flat = allOptions(options);
  const displayLabel =
    flat.find((o) => o.value === value)?.label ||
    value ||
    placeholder ||
    (required ? "Select..." : "None");

  const inputId = id ?? labelHtmlFor ?? name ?? uid;

  const commit = (val: string) => {
    if (!isControlled) setInternalValue(val);
    setIsOpen(false);
    // Fire a synthetic onChange event so existing handlers keep working unchanged
    if (onChange) {
      const nativeSelect = document.getElementById(`${inputId}-native`) as HTMLSelectElement | null;
      if (nativeSelect) {
        nativeSelect.value = val;
        nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
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
            value={value}
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e);
            }}
            className="sr-only"
            {...rest}
          >
            {!required && <option value="">None</option>}
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
              value ? "text-text" : "text-text/40"
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
            value === "" ? "bg-white/5 text-text" : ""
          )}
        >
          None
        </button>
      )}

      {/* Flat or grouped options */}
      {Array.isArray(options)
        ? flatOptions(options as OptionListType).map((o) => (
            <button
              key={`${uid}-${o.value}`}
              type="button"
              onClick={() => commit(o.value)}
              className={mergeClass(
                "w-full px-3 py-2 rounded-lg text-left text-sm text-text/80 hover:bg-white/5 transition",
                value === o.value ? "bg-white/5 text-text font-medium" : ""
              )}
            >
              {o.label}
            </button>
          ))
        : Object.entries(options as Record<string, OptionListType>).map(([group, list]) => (
            <div key={`${uid}-group-${group}`}>
              <div className="px-3 pt-2 pb-1 text-xs font-bold text-text/40 uppercase tracking-wider">
                {group}
              </div>
              {flatOptions(list).map((o) => (
                <button
                  key={`${uid}-${group}-${o.value}`}
                  type="button"
                  onClick={() => commit(o.value)}
                  className={mergeClass(
                    "w-full px-3 py-2 rounded-lg text-left text-sm text-text/80 hover:bg-white/5 transition",
                    value === o.value ? "bg-white/5 text-text font-medium" : ""
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
  className,
  id,
  children,
}: SelectProps & { children?: React.ReactNode }) {
  const uid = useId();
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = String(defaultValue ?? "");
  const [prevDefault, setPrevDefault] = useState(normalizedDefault);
  const [internalValue, setInternalValue] = useState(normalizedDefault);

  if (normalizedDefault !== prevDefault) {
    setPrevDefault(normalizedDefault);
    setInternalValue(normalizedDefault);
  }

  const value = isControlled ? String(controlledValue) : internalValue;
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
              value={value}
              aria-hidden="true"
              tabIndex={-1}
              onChange={(e) => {
                if (!isControlled) setInternalValue(e.target.value);
                onChange?.(e);
              }}
              className="sr-only"
            >
              {!required && <option value="">None</option>}
            </select>
          )}
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={mergeClass(
              "w-full text-left bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl pl-4 pr-10 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 disabled:opacity-50 disabled:cursor-not-allowed",
              value ? "text-text" : "text-text/40"
            )}
          >
            {value || placeholder || (required ? "Select..." : "None")}
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
