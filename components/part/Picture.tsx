"use client";

import { ImgHTMLAttributes, useRef } from "react";

export default function PartPicture({
  part,
  src,
  className,
  onError,
}: {
  part: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const defaultUrl = useRef(`/images/icons/${part}.png`);
  const classlist = ["rounded-lg bg-white aspect-square *:m-auto p-1"];
  if (className) {
    classlist.push(className);
  }

  return (
    <picture className={classlist.join(" ")}>
      <img
        src={src ?? defaultUrl.current}
        alt={src ?? defaultUrl.current}
        className="max-w-full max-h-full size-full"
        onError={(e) => {
          if (onError) onError(e);
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultUrl.current;
        }}
      />
    </picture>
  );
}
