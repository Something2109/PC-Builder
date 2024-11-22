"use client";

import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import { useState } from "react";

export function PictureInput({
  part: { image_url, part, name },
  className,
}: {
  part: { image_url?: string | null; part: string; name: string };
  className?: string;
}) {
  const [image, setImage] = useState<string | null>(image_url ?? null);
  const defaultUrl = `/images/icons/${part}.png`;

  return (
    <ColumnWrapper className={className}>
      <picture className="rounded-lg bg-white aspect-square *:m-auto p-1">
        <img
          src={image ?? defaultUrl}
          alt={name}
          className="max-w-full max-h-full size-full"
          onError={({ currentTarget }) => {
            setImage(null);
            currentTarget.src = defaultUrl;
          }}
        />
      </picture>
      <Input
        type="url"
        name="image_url"
        id="image_url"
        placeholder="Image URL"
        defaultValue={image_url ?? undefined}
        onChange={(e) => setImage(e.target.value)}
      />
    </ColumnWrapper>
  );
}
