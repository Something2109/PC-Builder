"use client";

import { useRef, useState } from "react";

import { mergeClass } from "../mergeClass";
import DropdownWrapper from "./DropdownWrapper";

// Accepts a plain string array or an array of value/label objects
export type SearchSelectOption = string | { value: string; label?: string };

function resolveOption(option: SearchSelectOption): { value: string; label: string } {
  if (typeof option === "string") return { value: option, label: option };
  return { value: option.value, label: option.label ?? option.value };
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  name?: string;
  label?: string;
  labelHtmlFor?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
  /** Override the rendered option row. Receives resolved value + label. */
  renderOption?: (resolved: { value: string; label: string }) => React.ReactNode;
  /** Shown inside the panel when no options match and allowCustom is false */
  emptyMessage?: string;
}

export default function SearchSelect({
  options,
  name,
  label,
  labelHtmlFor,
  defaultValue = "",
  value: controlledValue,
  onChange,
  placeholder = "Select...",
  allowCustom = false,
  clearable = true,
  className,
  inputClassName,
  renderOption,
  emptyMessage = "No options found",
}: Readonly<SearchSelectProps>) {
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = defaultValue ?? "";
  const [prevDefault, setPrevDefault] = useState(normalizedDefault);
  const [internalValue, setInternalValue] = useState(normalizedDefault);

  if (normalizedDefault !== prevDefault) {
    setPrevDefault(normalizedDefault);
    setInternalValue(normalizedDefault);
  }

  const value = isControlled ? controlledValue : internalValue;
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolved = options.map(resolveOption);

  const filtered = resolved.filter((o) => o.label.toLowerCase().includes(value.toLowerCase()));

  const exactMatch = filtered.some((o) => o.label.toLowerCase() === value.trim().toLowerCase());
  const showCustom = allowCustom && value.trim() !== "" && !exactMatch;
  const hasContent = filtered.length > 0 || showCustom;

  const commit = (val: string) => {
    if (!isControlled) setInternalValue(val);
    setIsOpen(false);
    onChange?.(val);
  };

  const handleClear = () => {
    commit("");
    inputRef.current?.focus();
  };

  const inputId = labelHtmlFor ?? name;

  return (
    <DropdownWrapper
      label={label}
      labelHtmlFor={inputId}
      isOpen={isOpen && hasContent}
      onClose={() => setIsOpen(false)}
      className={className}
      trigger={
        <>
          {/* Hidden form input */}
          {name && <input type="hidden" name={name} value={value} />}

          {/* Visible text input */}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={mergeClass(
              "w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl pl-4 pr-10 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200",
              inputClassName
            )}
          />

          {/* Clear button */}
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text/80 text-lg font-bold"
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
        </>
      }
    >
      {/* Option rows */}
      {filtered.map((o) =>
        renderOption ? (
          <button
            key={o.value}
            type="button"
            onClick={() => commit(o.value)}
            className="w-full text-left"
          >
            {renderOption(o)}
          </button>
        ) : (
          <button
            key={o.value}
            type="button"
            onClick={() => commit(o.value)}
            className="w-full px-3 py-2 rounded-lg text-left text-sm text-text/80 hover:bg-white/5 transition"
          >
            {o.label}
          </button>
        )
      )}

      {/* Custom-entry option */}
      {showCustom && (
        <button
          type="button"
          onClick={() => commit(value)}
          className="w-full px-3 py-2 rounded-lg text-left text-sm text-accent-indigo font-semibold hover:bg-white/5 transition"
        >
          + Add: &quot;{value}&quot;
        </button>
      )}

      {/* Empty state (always show panel when open so user sees the message) */}
      {filtered.length === 0 && !showCustom && isOpen && (
        <div className="px-3 py-2 text-sm text-text/40 italic">{emptyMessage}</div>
      )}
    </DropdownWrapper>
  );
}
