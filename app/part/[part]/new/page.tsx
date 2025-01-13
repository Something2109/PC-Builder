"use client";

import { PartForm } from "@/components/part/Form";
import { Products } from "@/utils/Enum";
import React from "react";

export default function PartDetailEditPage({
  params: { part },
}: {
  params: { part: string };
}) {
  return <PartForm part={part as Products} />;
}
