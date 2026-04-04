import * as Article from "@/utils/article";
import { ContentProps } from "../utils";

export function Section({
  content,
  prefix,
  children,
}: ContentProps<Article.Section> & { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1 w-full">
      <h1 className="font-bold text-2xl">{`${prefix} ${content.title}`}</h1>
      {children}
    </section>
  );
}
