import { Image as ImageType } from "@/utils/article";
import { ContentProps } from "../utils";
import Image from "next/image";

export function Picture({ content }: ContentProps<ImageType>) {
  return (
    <figure className="my-8 mx-auto flex flex-col items-center max-w-3xl w-full group">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md transition-all duration-500 hover:shadow-xl hover:scale-[1.005] w-full">
        <Image
          src={content.src || "/images/icons/pc.png"}
          alt={content.alt || content.caption || "Article image"}
          className="max-h-[520px] w-full object-cover select-none"
        />
      </div>
      {content.caption && (
        <figcaption className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-sans italic text-center px-4">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}
