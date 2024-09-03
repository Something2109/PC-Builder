import { SectionType } from "@/models/articles/article";
import { ContentRenderer } from "./utils";

export function Section({
  section,
  prefix,
}: {
  section: SectionType;
  prefix: string;
}) {
  let sectionCount = 1;
  return (
    <section className="flex flex-col gap-1 w-full">
      <h1 className="font-bold text-2xl">{`${prefix} ${section.title}`}</h1>
      {section.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${prefix}${
            content.type === "section" ? sectionCount++ : sectionCount
          }.`}
          key={`${prefix}${index}.${content.type}`}
        />
      ))}
    </section>
  );
}
