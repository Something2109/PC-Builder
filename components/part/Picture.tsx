"use client";

import { ImgHTMLAttributes, useRef } from "react";

const defaultClass = "aspect-square rounded-lg content-center bg-white p-1";

export default function PartPicture({
  part,
  src,
  className,
  onError,
}: {
  part: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const defaultUrl = useRef(`/images/icons/${part}.png`);

  return (
    <picture
      className={className ? className.concat(" ", defaultClass) : defaultClass}
    >
      <img
        src={src ?? defaultUrl.current}
        alt={`${part} picture`}
        className="mx-auto object-cover object-center overflow-hidden"
        onError={(e) => {
          if (onError) onError(e);
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultUrl.current;
        }}
      />
    </picture>
  );
}
