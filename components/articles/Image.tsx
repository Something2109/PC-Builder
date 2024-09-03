import { ImageType } from "@/models/articles/article";
import Image from "next/image";

export function Picture({ img }: { img: ImageType }) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={img.src} width={800} height={450} alt={img.caption} />
      <p>{img.caption}</p>
    </picture>
  );
}
