"use client";

import { HTMLAttributes, useState } from "react";

import { Button } from "./Button";
import { RowWrapper } from "./FlexWrapper";

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
      <Button type="button" onClick={() => setToggle(true)}>
        {label ?? "Add"}
      </Button>
    );
  }

  return (
    <RowWrapper {...rest}>
      {children}
      <Button type="button" onClick={() => setToggle(false)}>
        Remove
      </Button>
    </RowWrapper>
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
