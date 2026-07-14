"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  // Recalculate panel position to align with the trigger element
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 10,
    });
  };

  // Snap position immediately when opening (before paint)
  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen]);

  // Keep position in sync while open (scroll / resize in any ancestor)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Click-outside: close when clicking outside both the trigger and the portal panel
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const closestRoot = containerRef.current?.closest(
      '[data-overlay-root="true"]'
    ) as HTMLElement | null;
    const el = closestRoot ?? document.getElementById("dropdown-root") ?? document.body;
    queueMicrotask(() => setMountNode(el));
  }, []);

  return (
    <div className={mergeClass("space-y-2 w-full", className)} ref={containerRef}>
      {label && (
        <label htmlFor={labelHtmlFor} className="text-sm font-bold text-text/70 block">
          {label}
        </label>
      )}
      <div className="relative" ref={triggerRef}>
        {trigger}
      </div>

      {/* Portal — rendered in dropdown-root to escape any ancestor overflow clipping */}
      {isOpen &&
        mountNode &&
        createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className={mergeClass(
              "bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-1 duration-200",
              panelClassName ?? "max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar"
            )}
          >
            {children}
          </div>,
          mountNode
        )}
    </div>
  );
}
