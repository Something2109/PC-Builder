"use client";

import { InfoForm } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Products } from "@/utils/Enum";
import { ProductInfo } from "@/utils/interface";
import { use, useRef } from "react";

export default function PartDetailNewPage({
  params,
}: {
  params: Promise<{ part: Products }>;
}) {
  const { part } = use(params);

  const SaveLink = useRef(`/api/part/${part}`);

  return (
    <>
      <PartForm path={SaveLink.current} part={part} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) => (
            <InfoForm key={info} path={SaveLink.current} info={info} />
          ))}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
