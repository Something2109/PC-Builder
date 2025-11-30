import * as Article from "@/utils/article";
import Image from "next/image";
import { ContentProps } from "../utils";

export function Picture({ content }: ContentProps<Article.Image>) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={content.src} width={800} height={450} alt={content.caption} />
      <p>{content.caption}</p>
    </picture>
  );
}
