"use client";

import { useEffect, useRef } from "react";

import { mergeClass } from "../mergeClass";

interface DropdownWrapperProps {
  label?: string;
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelHtmlFor?: string;
  panelClassName?: string;
}

export default function DropdownWrapper({
  label,
  isOpen,
  onClose,
  trigger,
  children,
  className,
  labelHtmlFor,
  panelClassName,
}: Readonly<DropdownWrapperProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={mergeClass("space-y-2 relative w-full", className)} ref={containerRef}>
      {label && (
        <label htmlFor={labelHtmlFor} className="text-sm font-bold text-text/70 block">
          {label}
        </label>
      )}
      <div className="relative">{trigger}</div>
      {isOpen && (
        <div
          className={mergeClass(
            "absolute left-0 right-0 z-50 mt-1 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-1 duration-200",
            panelClassName ?? "max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
