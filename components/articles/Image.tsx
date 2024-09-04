"use client";

import { Button } from "@/components/utils/Button";
import { ImageType } from "@/models/articles/article";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { InputArea, InputContentParameters } from "./utils";

export function Picture({ img }: { img: ImageType }) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={img.src} width={800} height={450} alt={img.caption} />
      <p>{img.caption}</p>
    </picture>
  );
}

export function PictureInput({
  content,
  updateSelf,
}: InputContentParameters<ImageType>) {
  const [src, setSource] = useState<string>("");
  const origin = useRef(content.src);

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      content.src = URL.createObjectURL(image);
      setSource(content.src);

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
  };

  const resetImage = () => {
    content.src = origin.current;
    setSource(content.src);

    console.log(content);
  };

  const removeImage = () => {
    URL.revokeObjectURL(content.src);
    content.image = undefined;

    content.src = "";
    setSource(content.src);

    console.log(content);
  };
  console.log(origin.current);
  return (
    <picture className="*:mx-auto *:my-2 w-full text-center border-2 rounded-xl p-3">
      {content.src.length > 0 ? (
        <Image
          src={content.src}
          width={800}
          height={450}
          alt={content.caption}
        />
      ) : (
        <input type="file" placeholder="Image" onChange={(e) => addImage(e)} />
      )}

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
