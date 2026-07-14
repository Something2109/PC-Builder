"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { mergeClass } from "../mergeClass";

interface ModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export default function ModalWrapper({
  children,
  isOpen,
  onClose,
  title,
  className,
}: Readonly<ModalWrapperProps>) {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById("modal-root") ?? document.body;
    queueMicrotask(() => setMountNode(el));
  }, []);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !mountNode) return null;

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className={mergeClass(
          "bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative flex flex-col space-y-4 animate-in zoom-in-95 duration-200",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-xl font-bold text-text">{title ?? "Hardware Details"}</h3>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition text-text/60 hover:text-text font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>,
    mountNode
  );
}
