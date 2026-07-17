"use client";

import React, { useEffect, useRef, useState } from "react";

// Helper for conditional classes
function mergeClass(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: y, left: x }}
      className="fixed bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/40 rounded-xl shadow-2xl p-1.5 z-55 min-w-40 flex flex-col font-sans select-none animate-in fade-in zoom-in-95 duration-100 focus:outline-none"
    >
      {children}
    </div>
  );
}

export interface ContextMenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function ContextMenuItem({
  onClick,
  children,
  className,
  disabled = false,
}: ContextMenuItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={mergeClass(
        "w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none",
        className
      )}
    >
      {children}
    </button>
  );
}

export function ContextMenuSeparator() {
  return <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1 mx-1" />;
}

export interface ContextMenuWrapperProps {
  menu: (props: { onClose: () => void }) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ContextMenuWrapper({ menu, children, className, style }: ContextMenuWrapperProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClose = () => {
    setPosition(null);
  };

  return (
    <div onContextMenu={handleContextMenu} className={className} style={style}>
      {children}
      {position && (
        <ContextMenu x={position.x} y={position.y} onClose={handleClose}>
          {menu({ onClose: handleClose })}
        </ContextMenu>
      )}
    </div>
  );
}
