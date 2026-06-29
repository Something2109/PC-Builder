"use client";

import { HTMLAttributes, useState } from "react";

import { Button } from "./Button";
import { mergeClass } from "./mergeClass";

export function Toggler({
  label,
  defaultToggle,
  children,
  ...rest
}: {
  label?: string;
  defaultToggle?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const [toggle, setToggle] = useState(Boolean(defaultToggle));

  if (!toggle) {
    return (
      <button
        type="button"
        onClick={() => setToggle(true)}
        className="text-xs px-2.5 py-1.5 border border-border/85 hover:border-accent-indigo hover:text-accent-indigo hover:bg-accent-indigo/5 rounded-lg bg-card/30 transition-all shrink-0 whitespace-nowrap"
      >
        {label ?? "Add"}
      </button>
    );
  }

  return (
    <div
      className={mergeClass(
        "flex flex-col gap-2 p-3 border border-border rounded-xl bg-slate-50/5 w-full",
        rest.className
      )}
      {...rest}
    >
      <div className="flex-1 w-full text-left">{children}</div>
      <div className="flex justify-end pt-1 border-t border-border/40">
        <button
          type="button"
          onClick={() => setToggle(false)}
          className="text-[10px] font-semibold py-1 px-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-md transition-colors"
        >
          Remove Filter
        </button>
      </div>
    </div>
  );
}

export function ToggleButton({
  label,
  defaultToggle,
  children,
}: {
  label?: string;
  defaultToggle?: boolean;
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(Boolean(defaultToggle));

  return (
    <>
      <Button type="button" onClick={() => setToggle((prev) => !prev)}>
        {toggle ? "Close" : label}
      </Button>
      {toggle && children}
    </>
  );
}
