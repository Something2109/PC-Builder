"use client";

import { ImgHTMLAttributes } from "react";

import { mergeClass } from "@/ui/mergeClass";

const createDefaultUrl = (part: string) => `/images/icons/${part}.png`;

export default function PartPicture({
  part,
  src,
  className,
  onError,
}: {
  part: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const defaultUrl = createDefaultUrl(part);

  return (
    <picture
      className={mergeClass(
        "aspect-square rounded-lg content-center bg-white p-1",
        className
      )}
    >
      <img
        src={src ?? defaultUrl}
        alt={`${part}`}
        className="min-h-full min-w-full object-cover object-center overflow-hidden"
        onError={(e) => {
          if (onError) onError(e);
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultUrl;
        }}
      />
    </picture>
  );
}
