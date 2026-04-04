"use client";

import * as Article from "@/utils/article";
import { RowWrapper } from "@/ui/FlexWrapper";
import { TextArea } from "@/ui/Input";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/ui/Button";

type ImageInput = Article.Image & {
  image?: string;
};

const PictureInput = function ({
  content,
  children,
}: {
  content: ImageInput;
  children: React.ReactNode;
}) {
  const initial = useRef(content.src);
  const getImageFromSrc = useCallback(() => {
    return content.src.length > 0 ? (
      <img src={content.src} alt={content.caption} />
    ) : (
      <input type="file" placeholder="Image" onChange={(e) => addImage(e)} />
    );
  }, []);
  const [img, setImg] = useState<React.ReactNode | null>(getImageFromSrc());

  const addImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const image = e.target.files[0];

        content.src = URL.createObjectURL(image);
        setImg(getImageFromSrc());

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
    },
    [content, getImageFromSrc]
  );

  const removeImage = useCallback(() => {
    URL.revokeObjectURL(content.src);
    delete content.image;

    content.src = "";
    setImg(getImageFromSrc());
  }, [content, getImageFromSrc]);

  const resetImage = useCallback(() => {
    removeImage();

    content.src = initial.current;
    setImg(getImageFromSrc());
  }, [content, getImageFromSrc, removeImage]);

  return (
    <RowWrapper className="border-2 rounded-xl p-3 justify-between w-full">
      <picture className="*:mx-auto *:my-2 text-center w-full">
        {img}
        <TextArea
          className="text-center w-full"
          placeholder="Caption"
          defaultValue={content.caption}
          onChange={(e) => (content.caption = e.target.value)}
        />
        <RowWrapper className="justify-center">
          {content.src.length > 0 && (
            <Button onClick={removeImage}>Remove image</Button>
          )}
          <Button onClick={resetImage}>Reset</Button>
        </RowWrapper>
      </picture>
      {children}
    </RowWrapper>
  );
};

export default PictureInput;
