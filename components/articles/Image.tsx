"use client";

import { Button } from "@/components/utils/Button";
import { ImageType } from "@/models/articles/article";
import { RowWrapper, ColumnWrapper } from "@/components/utils/FlexWrapper";
import Image from "next/image";
import { useCallback, useState } from "react";
import { ContentProps, InputArea, InputContentProps } from "./utils";

export function Picture({ content }: ContentProps<ImageType>) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={content.src} width={800} height={450} alt={content.caption} />
      <p>{content.caption}</p>
    </picture>
  );
}

export function PictureInput({
  content,
  updateSelf,
}: InputContentProps<ImageType>) {
  const getImageFromSrc = useCallback(() => {
    return content.src.length > 0 ? (
      <Image src={content.src} width={800} height={450} alt={content.caption} />
    ) : (
      <input type="file" placeholder="Image" onChange={(e) => addImage(e)} />
    );
  }, []);
  const [img, setImg] = useState<React.ReactNode | null>(getImageFromSrc());

  const addImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      content.src = URL.createObjectURL(image);
      setImg(getImageFromSrc());

      console.log(content);

      const reader = new FileReader();
      if (reader) {
        reader.onloadend = () => {
          if (reader.result) {
            content.image = reader.result.toString();
          }
        };
        reader.readAsDataURL(image);
      }
    }
  }, []);

  const resetImage = useCallback(() => {
    removeImage();

    if (content.initial) {
      content.src = content.initial;
      delete content.initial;
    }
    setImg(getImageFromSrc());

    console.log(content);
  }, []);

  const removeImage = useCallback(() => {
    URL.revokeObjectURL(content.src);
    delete content.image;

    if (!content.initial) {
      content.initial = content.src;
    }
    content.src = "";
    setImg(getImageFromSrc());

    console.log(content);
  }, []);

  return (
    <RowWrapper className="border-2 rounded-xl p-3">
      <picture className="*:mx-auto *:my-2 text-center">
        {img}
        <InputArea
          className="text-center"
          placeholder="Caption"
          defaultValue={content.caption}
          onChange={(e) => (content.caption = e.target.value)}
        />
      </picture>
      <ColumnWrapper>
        <Button onClick={updateSelf.shiftUp}>Up</Button>
        {content.src.length === 0 ? (
          <Button onClick={updateSelf.remove}>Remove</Button>
        ) : (
          <Button onClick={removeImage}>Remove image</Button>
        )}
        {content.initial ? (
          <Button onClick={resetImage}>Reset</Button>
        ) : undefined}
        <Button onClick={updateSelf.shiftDown}>Down</Button>
      </ColumnWrapper>
    </RowWrapper>
  );
}
