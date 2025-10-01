"use client";

import { Button } from "@/components/utils/Button";
import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";

const defaultClass = "justify-center items-center gap-4";

export default function ErrorPanel({
  text,
  reset,
  className,
  ...rest
}: {
  text: string;
  reset: () => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <ColumnWrapper
      className={className ? defaultClass.concat(" ", className) : defaultClass}
      {...rest}
    >
      <picture className="">
        <Image
          src={`/images/icons/error.png`}
          alt={`error logo`}
          className="dark:invert transition-props"
          width="128"
          height="128"
        />
      </picture>
      <h1 className="block text-bold text-2xl">{text}</h1>
      <Button className="w-fit px-4" onClick={() => reset()}>
        Try again ?
      </Button>
    </ColumnWrapper>
  );
}
