"use client";

import { PartForm } from "@/components/part/Form";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/info/Parts";
import React from "react";

export default function PartDetailEditPage({
  params: { part },
}: {
  params: { part: Products };
}) {
  const value: Part.BasicInfo = {
    part,
    id: "",
    name: "",
    code_name: "",
    brand: "",
    series: "",
  };

  return <PartForm part={part} defaultValue={value} />;
}
