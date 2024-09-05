"use client";

import { Button } from "@/components/utils/Button";
import { ImageType } from "@/models/articles/article";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { InputArea, ContentProps } from "./utils";

export function Picture({ img }: { img: ImageType }) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={img.src} width={800} height={450} alt={img.caption} />
      <p>{img.caption}</p>
    </picture>
  );
}

export function PictureInput({ content, updateSelf }: ContentProps<ImageType>) {
  const origin = useRef(content.src);

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
        reader.onloadend = (ev) => {
          if (reader.result) {
            content.image = reader.result.toString();
          }
        };
        reader.readAsDataURL(image);
      }
    }
  }, []);

  const resetImage = useCallback(() => {
    content.src = origin.current;
    setImg(getImageFromSrc());

    console.log(content);
  }, []);

  const removeImage = useCallback(() => {
    URL.revokeObjectURL(content.src);
    content.image = undefined;

    content.src = "";
    setImg(getImageFromSrc());

    console.log(content);
  }, []);

  return (
    <picture className="*:mx-auto *:my-2 w-full text-center border-2 rounded-xl p-3">
      {img}

      <InputArea
        rows={1}
        className="text-center"
        placeholder="Caption"
        defaultValue={content.caption}
        onChange={(e) => (content.caption = e.target.value)}
      />
      <div className="flex flex-row gap-1 justify-around">
        <Button onClick={() => updateSelf.shiftUp()}>Up</Button>
        {content.src.length === 0 ? (
          <Button onClick={() => updateSelf.remove()}>Remove</Button>
        ) : (
          <Button onClick={() => removeImage()}>Remove image</Button>
        )}
        <Button onClick={() => resetImage()}>Reset</Button>
        <Button onClick={() => updateSelf.shiftDown()}>Down</Button>
      </div>
    </picture>
  );
}
